import * as React from 'react';

import { MessageAttachments } from '@components/MessageAttachments/MessageAttachments';
import { MessageList } from '@components/MessageList/MessageList';
import { Avatar } from '@components/Avatar/Avatar';
import { formatDate } from '@lib/formatDate';
import { getAccountName } from '@lib/getAccountName';

import type { IMessageProps } from './Message.typings';
import {
    messageCn,
    messageAuthorCn,
    messageAvatarCn,
    messageBodyCn,
    messageDateCn,
    messageForwardedCn,
    messagePhotoCn,
    messageTextCn,
} from './Message.const';

import './Message.scss';

export const Message: React.FC<IMessageProps> = ({ message, accounts, depth = 0 }) => {
    const { user, name } = React.useMemo(() => {
        const absId = Math.abs(message.from_id);

        let user = accounts.get(message.from_id) ?? {
            first_name: message.from_id > 0 ? 'user' : 'group',
            last_name: String(absId),
            id: message.from_id,
            screen_name: `${message.from_id > 0 ? 'id' : 'club'}${absId}`,
            photo_50: 'https://vk.com/images/camera_50.png',
            photo_100: 'https://vk.com/images/camera_100.png',
        };

        return {
            user,
            name: getAccountName(user),
        };
    }, [message.from_id]);

    const date = React.useMemo(
        () => (message.id ? `#${message.id}, ` : '') + formatDate(message.date),
        [message.id, message.date],
    );

    return (
        <div className={messageCn}>
            <div className={messageAvatarCn}>
                <Avatar
                    className={messagePhotoCn}
                    info={user}
                    alt={name}
                    size={depth === 0 ? 'm' : 's'}
                />
            </div>
            <div className={messageAuthorCn}>
                <a
                    href={`https://apidog.ru/#${user.screen_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {name}
                </a>
            </div>
            <div className={messageBodyCn}>
                <div className={messageTextCn}>{message.text}</div>
                {message.attachments !== undefined && message.attachments.length > 0 && (
                    <MessageAttachments items={message.attachments} />
                )}
                {message.fwd_messages !== undefined && message.fwd_messages.length > 0 && (
                    <div className={messageForwardedCn}>
                        <MessageList
                            messages={message.fwd_messages}
                            accounts={accounts}
                            depth={depth + 1}
                        />
                    </div>
                )}
                <div className={messageDateCn}>{date}</div>
            </div>
        </div>
    );
};
