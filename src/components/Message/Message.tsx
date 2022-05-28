import * as React from 'react';
import * as Sugar from 'sugar';
import type { IMessage, IUser } from '@apidog/vk-typings';

import { MessageAttachments } from '@components/MessageAttachments/MessageAttachments';
import { MessageList } from '@components/MessageList/MessageList';
import type { IAccountMap } from '@typings/IAccountMap';
import { isGroupObject } from '@utils/isGroupObject';

import './Message.scss';

export interface IMessageProps {
    accounts: IAccountMap;
    message: IMessage;
    depth?: number;
}

export const Message: React.FC<IMessageProps> = ({ message, accounts, depth = 0 }) => {
    const { user, name } = React.useMemo(() => {
        let user = accounts.get(message.from_id);

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
        <div className="Message">
            <div className="Message-Avatar">
                <img
                    className="Message-Photo"
                    src={user.photo_50}
                    alt={name}
                />
            </div>
            <div className="Message-Author">
                <a
                    href={`https://apidog.ru/#${user.screen_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {name}
                </a>
            </div>
            <div className="Message-Body">
                <div className="Message-Text">{message.text}</div>
                {message.attachments && message.attachments.length > 0 && (
                    <MessageAttachments items={message.attachments} />
                )}
                {message.fwd_messages && message.fwd_messages.length > 0 && (
                    <div className="Message-Forwarded">
                        <MessageList
                            messages={message.fwd_messages}
                            accounts={accounts}
                            depth={depth + 1}
                        />
                    </div>
                )}
                <div className="Message-Date">{date}</div>
            </div>
        </div>
    );
};
