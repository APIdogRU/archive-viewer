import * as React from 'react';
import * as Sugar from 'sugar';
import MessageAttachments from '../MessageAttachments';
import MessagesList from "../MessageList";
import { IMessage, IAccount, IUser, IGroup } from '@apidog/vk-typings';
import 'sugar/locales/ru';
import './Message.scss';

export interface IMessageProps {
    getUser: (userId: number) => IAccount;
    message: IMessage;
    depth?: number;
}

export default class Message extends React.Component<IMessageProps> {
    private getName = (info: IAccount) => {
        return (info as IGroup).name || `${(info as IUser).first_name} ${(info as IUser).last_name}`;
    }

    render() {
        const { message, getUser, depth } = this.props;

        let user = getUser(message.from_id);

        if (!user) {
            user = {
                id: 0,
                first_name: 'unknown',
                last_name: 'user/group',
                screen_name: (message.from_id < 0 ? "club" : "id") + Math.abs(message.from_id)
            } as IUser;
        }

        return (
            <div className="message">
                <div className="message-avatar">
                    <img
                        className="message-photo"
                        src={user.photo_50}
                        alt={this.getName(user)} />
                </div>
                <div className="message-content">
                    <div className="message-author">
                        <a
                            href={`https://apidog.ru/6.6/#${user.screen_name}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            {this.getName(user)}
                        </a>
                    </div>
                    <div className="message-body">
                        <div className="message-text">{message.text}</div>

                        {message.attachments && message.attachments.length > 0 && <MessageAttachments items={message.attachments} />}
                        {message.fwd_messages && message.fwd_messages.length > 0 && (
                            <div className="message-fwd_wrap">
                                <MessagesList
                                    messages={message.fwd_messages}
                                    getUser={getUser}
                                    depth={depth + 1} />
                                </div>
                         )}
                        <div className="message-date">
                            {message.id ? `#${message.id}, ` : ''}{Sugar.Date.long(new Date(message.date * 1000), 'ru')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
