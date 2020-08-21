import { Array as SArray } from 'sugar';
import { stringify } from 'querystring';
import { IMessage, IAccount, IUser, IGroup } from '@apidog/vk-typings';
import { IArchiveRoot, IUserTable, IPeriodInfo } from '../typings/types';

/**
 *
 */
export type IPeriodMessageStorage = Record<number, Record<number, IMessage[]>>;


export default class MessageController {
    /**
     * Все сообщения
     */
    private messages: IMessage[];

    /**
     * Информация о пользователях и группах
     */
    private users: Record<number, IAccount>;

    /**
     * Сгруппированные сообщения
     */
    private messagesGrouped: IPeriodMessageStorage;

    /**
     * Чтение из архива
     */
    public readFromArchive = async(archive: IArchiveRoot) => {
        const rawUsers = await this.fetchUserInfo(archive);

        this.users = rawUsers.reduce((users: IUserTable, user: IUser) => {
            users[user.id] = user;
            return users;
        }, {});

        this.messages = archive.data.map(this.fixMessages);

        this.groupByPeriods();
    };

    /**
     * Даунгрейд для новых версий API
     * reply_to_message -> fwd_messages[] (новые ответы как в Telegram, ничего своего придумать не могут)
     * fwd_messages -> fwd_messages (рекурсивно обработать остальные сообщения)
     */
    private fixMessages = (message: IMessage) => {
        if (message.reply_message) {
            (message.fwd_messages || (message.fwd_messages = [])).unshift(message.reply_message);
        }

        if (message.fwd_messages) {
            message.fwd_messages = message.fwd_messages.map(this.fixMessages);
        }

        return message;
    };

    /**
     * Запрос инфы о пользователях и группах по ID
     */
    public fetchUserInfo = async(archive: IArchiveRoot): Promise<IAccount[]> => {
        console.log('Fetching users info');

        const collectUsers = (userIds: Set<number>, message: IMessage) => {
            userIds.add(message.from_id);

            if (message.fwd_messages) {
                message.fwd_messages.reduce(collectUsers, userIds);
            }

            return userIds;
        };

        const userIds = archive.data.reduce(collectUsers, new Set());

        const s = SArray.inGroupsOf(Array.from(userIds), 100) as unknown as number[][];
        const groups = s.map((a: number[]) => SArray.compact(a));

        let result: IAccount[] = [];

        for (let i = 0; i < groups.length; ++i) {
            const userIds = groups[i].join(',');
            const res = await fetch('https://apidog.ru/archive-viewer/getUsers.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: stringify({ userIds })
            });

            const { response }: { response: IAccount[] } = await res.json();

            result = result.concat(response);
        }

        console.log('User info fetched');

        return result;
    };

    /**
     * Разделение всех сообщений по группам-периодам
     */
    private groupByPeriods = () => {
        const years: IPeriodMessageStorage = {};

        const add = (message: IMessage) => {
            const date = new Date(message.date * 1000);
            const y = date.getFullYear();
            const m = date.getMonth();

            if (!(y in years)) {
                years[y] = {};
            }

            if (!(m in years[y])) {
                years[y][m] = [];
            }

            years[y][m].push(message);
        };

        this.messages.forEach(add);
        this.messagesGrouped = years;
    };

    /**
     * Получение пользователя/группы по ID
     */
    public getUserById = (userId: number): IAccount => this.users[userId];

    /**
     * Получение списка сообщений по периоду
     */
    public getMessagesByPeriod = (year: number, month: number): IMessage[] => this.messagesGrouped[year][month];

    /**
     * Получение информации о периодах в удобном формате
     */
    public getPeriods = (): IPeriodInfo[] => {
        const result: IPeriodInfo[] = [];
        const years = Object.keys(this.messagesGrouped) as unknown as number[];

		for (const year of years) {
            const months = Object.keys(this.messagesGrouped[year]) as unknown as number[];

            months.forEach(month => {
                const count = this.messagesGrouped[year][month].length;
                result.push({ year, month, count });
            });
        }

        return result;
    }
}