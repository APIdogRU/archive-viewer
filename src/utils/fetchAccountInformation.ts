import type { IAccount, IGroup, IMessage, IVkApiError, IVkApiResponse } from '@apidog/vk-typings';
import type { IAccountMap } from '@typings/IAccountMap';
import type { IArchiveRoot } from '@typings/IArchiveRoot';
import { splitArrayToChunks } from './splitArrayToChunks';

/**
 * Кладёт идентификаторы пользователей/сообществ в сет
 * @param userIds Сет уникальных идентификаторов пользователей
 * @param message Сообщение
 * @returns Тот же сет userIds
 */
function collectUsers(userIds: Set<number>, message: IMessage): Set<number> {
    userIds.add(message.from_id);

    if (message.fwd_messages) {
        message.fwd_messages.reduce(collectUsers, userIds);
    }

    return userIds;
}

function isGroupObject(object: IAccount): object is IGroup {
    return 'name' in object;
}


/**
 * Собирает все идентификаторы пользователей и сообществ из архива и пытается получить
 * информацию о них в виде удобного словаря (Map<number, IAccount>)
 * @param archive Объект архива
 * @returns Словарь с информацией о пользователях и сообществах
 */
export async function fetchAccountInformation(archive: IArchiveRoot): Promise<IAccountMap> {
    const userIds = archive.data.reduce(collectUsers, new Set<number>());

    const chunks = splitArrayToChunks(Array.from(userIds).filter(Boolean), 100);

    const accounts: IAccountMap = new Map<number, IAccount>();

    for (let i = 0; i < chunks.length; ++i) {
        const userIds = chunks[i].join(',');
        const request = await fetch('https://apidog.ru/api/v4/vk.getUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ userIds }).toString(),
        });

        const result = (await request.json()) as IVkApiResponse<IAccount[]> | IVkApiError;

        if ('response' in result) {
            result.response.forEach(item => {
                const id = isGroupObject(item) ? -item.id : item.id;

                accounts.set(id, item);
            });
        } else {
            console.log('fetchAccountInformation: no response', result.error)
        }
    }

    return accounts;
}
