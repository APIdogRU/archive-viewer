import * as React from 'react';

import { Message } from '@components/Message/Message';

import { DateHeader } from './-DateHeader/MessageList-DateHeader';
import type { IMessageListProps } from './MessageList.typings';
import { stringifyDate } from './MessageList.utils/stringifyDate';
import { messageListCn, messageListInfoCn } from './MessageList.const';

import './MessageList.scss';

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

                list.push(<DateHeader key={`head${lastDate}`} date={message.date} />);
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
            <div className={messageListInfoCn}>Нет сообщений в данном периоде</div>
        );
    }

    return (
        <div className={messageListCn}>{list}</div>
    );
};
