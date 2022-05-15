import * as React from 'react';
import type { IAccount, IMessage } from '@apidog/vk-typings';
import * as Sugar from 'sugar';
import 'sugar/locales/ru';

import Message from '@components/Message';

import './MessageList.scss';

export type IMessageListProps = {
    messages: IMessage[];
    getUser: (userId: number) => IAccount;
    depth?: number;
};

const MessageList: React.FC<IMessageListProps> = (props: IMessageListProps) => {
    const { messages, depth, getUser } = props;

    const list = [];

    if (!messages || !messages.length) {
        return (
            <div className="messagelist__empty">Нет сообщений по заданному запросу</div>
        );
    }

    let last: number = null;

    // дичь с циклом нужна для вставки "шапок" с датами
    for (const message of messages) {
        const date = new Date(message.date * 1000);

        if (depth === 0 && date.getDate() !== last) {
            last = date.getDate();
            list.push(
                <div
                    key={`head${last}`}
                    className="messagelist-subheader">
                    {Sugar.Date.medium(date, 'ru')}
                </div>
            );
        }

        list.push(
            <Message
                key={`msg${message.id || `fwd${message.date}_${message.from_id}`}`}
                getUser={getUser}
                message={message}
                depth={depth} />
        );
    }

    return (
        <div className="messagelist-list">
            {list}
        </div>
    );
};

export default MessageList;
