import * as React from 'react';
import type { IMessage, IAccount, IUser, IGroup } from '@apidog/vk-typings';
import * as Sugar from 'sugar';
import 'sugar/locales/ru';

import MessageAttachments from '@components/MessageAttachments';
import MessagesList from '@components/MessageList';

import './Message.scss';
import isGroupObject from '@utils/isGroupObject';

export interface IMessageProps {
    getUser: (userId: number) => IAccount;
    message: IMessage;
    depth?: number;
}

const Message: React.FC<IMessageProps> = props => {
    const { message, getUser, depth } = props;

    const { user, name } = React.useMemo(() => {
        let user = getUser(message.from_id);

        if (!user) {
            const idPrefix = message.from_id < 0 ? 'club' : 'id';
            user = {
                id: 0,
                first_name: 'unknown',
                last_name: 'user/group',
                screen_name: `${idPrefix}${Math.abs(message.from_id)}`,
            } as IUser;
        }

        const name = isGroupObject(user) ? user.name : `${user.first_name} ${user.last_name}`;

        return { user, name };
    }, [message.from_id]);

    const date = React.useMemo(
        () => (message.id ? `#${message.id}, ` : '') + Sugar.Date.long(new Date(message.date * 1000), 'ru'),
        [message.id, message.date],
    );

    return (
        <div className="message">
            <div className="message-avatar">
                <img
                    className="message-photo"
                    src={user.photo_50}
                    alt={name} />
            </div>
            <div className="message-content">
                <div className="message-author">
                    <a
                        href={`https://apidog.ru/6.6/#${user.screen_name}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        {name}
                    </a>
                </div>
                <div className="message-body">
                    <div className="message-text">{message.text}</div>
                    {message.attachments?.length > 0 && <MessageAttachments items={message.attachments} />}
                    {message.fwd_messages?.length > 0 && (
                        <div className="message-fwd_wrap">
                            <MessagesList
                                messages={message.fwd_messages}
                                getUser={getUser}
                                depth={depth + 1} />
                        </div>
                    )}
                    <div className="message-date">{date}</div>
                </div>
            </div>
        </div>
    );
};

export default Message;
