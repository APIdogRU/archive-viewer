import * as React from 'react';
import type { IMessage } from '@apidog/vk-typings';
import type { IAccountMap } from '@typings/IAccountMap';

import { Message } from '@components/Message/Message';

import { DateHeader } from './MessageList.components/DateHeader/DateHeader';

import './MessageList.scss';

interface IMessageListProps {
    messages: IMessage[];
    accounts: IAccountMap;
    depth?: number;
}

const stringifyDate = (date: Date): string => `${date.getFullYear}/${date.getMonth()}/${date.getDate()}`;

export const MessageList: React.FC<IMessageListProps> = ({ messages, accounts, depth = 0 }) => {
    const list: React.ReactNode[] = [];

    const isRootDepth = depth === 0;

    if (messages?.length) {
        let lastDate: string = '';

        // дичь с циклом нужна для вставки "шапок" с датами
        for (const message of messages) {
            const date = new Date(message.date * 1000);
            const stringifiedDate = stringifyDate(date);

            if (isRootDepth && stringifiedDate !== lastDate) {
                lastDate = stringifiedDate;

                list.push(<DateHeader key={`head${lastDate}`} date={date} />);
            }

            list.push(
                <Message
                    key={`msg${message.id || `fwd${message.date}_${message.from_id}_${depth}`}`}
                    accounts={accounts}
                    message={message}
                    depth={depth}
                />
            );
        }
    } else {
        list.push(
            <div className="MessageList-Info">Нет сообщений в данном периоде</div>
        );
    }

    return (
        <div className="MessageList">
            {list}
        </div>
    );
};
