import * as React from 'react';
import Message from '../Message';
import * as Sugar from 'sugar';
import 'sugar/locales/ru';
import './MessageList.scss';
import { IAccount, IUser, IGroup, IMessage } from '@apidog/vk-typings';

export interface IMessageListProps {
    messages: IMessage[];
    getUser: (userId: number) => IAccount;
    depth?: number;
}

export default class MessageList extends React.Component<IMessageListProps> {
    render() {
        const { messages, depth, getUser } = this.props;

        messages.reverse();

        const list = [];

        if (!messages || !messages.length) {
            return (
                <div className="messagelist__empty">Нет сообщений по заданному запросу</div>
            );
        }

        let last: number = null;
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
                    key={`msg${message.id || -Math.floor(Math.random() * 100000)}`}
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
    }
}
