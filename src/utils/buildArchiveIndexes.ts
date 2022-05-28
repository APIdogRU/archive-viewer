import type { IMessage } from '@apidog/vk-typings';
import type { IArchiveIndex } from '@typings/IArchiveIndex';
import type { IArchiveRoot } from '@typings/IArchiveRoot';
import type { IPeriodInfo } from '@typings/IPeriodInfo';
import type { IPeriodRange } from '@typings/IPeriodRange';

interface IPeriodItem {
    items: IMessage[];
    startIndex: number;
}

type IPeriodIndex = Record<number, Record<number, IPeriodItem>>;
type IDateTuple = [number, number]; // [year, month]

/**
 *
 * @param this Индекс сообщений
 * @param message Текущее сообщение
 * @param index Индекс текущего сообщения в массиве сообщений
 */
function pushMessage(this: IPeriodIndex, message: IMessage, index: number) {
    const [year, month] = getMessageDate(message);

    if (!(year in this)) {
        this[year] = {};
    }

    if (!(month in this[year])) {
        this[year][month] = { items: [], startIndex: index };
    }

    this[year][month].items.push(message);
}

function getMessageDate(message: IMessage): IDateTuple {
    const date = new Date(message.date * 1000);

    return [date.getFullYear(), date.getMonth()];
}

export function buildArchiveIndexes(archive: IArchiveRoot): IArchiveIndex {
    const messages = archive.data;
    const periods: IPeriodInfo[] = [];

    if (messages.length) {
        const index: IPeriodIndex = {};

        messages.forEach(pushMessage.bind(index));

        for (const yearKey in index) {
            if (!index.hasOwnProperty(yearKey)) continue;

            const year = Number(yearKey);

            for (const monthKey in index[yearKey]) {
                if (!index[yearKey].hasOwnProperty(monthKey)) continue;

                const month = Number(monthKey);
                const { items, startIndex } = index[yearKey][monthKey];
                const count = items.length;
                const range: IPeriodRange = [startIndex, startIndex + count];

                periods.push({ year, month, count, range });
            }
        }
    }

    return { periods };
}
