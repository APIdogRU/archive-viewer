import * as React from 'react';
import Message from '../Message';
import * as Sugar from 'sugar';
import 'sugar/locales/ru';
import { IVKMessage } from '@apidog/vk-typings';
import { IUserTable } from '../../typings/types';

export interface IMessageListProps {
	messages: IVKMessage[];
	users: IUserTable;
	depth?: number;
	showAllMessages?: boolean;
	query?: string;
}

export default class MessageList extends React.Component<IMessageListProps> {
	render() {
		const { messages, users, depth, showAllMessages } = this.props;

		const list = [];

		const needOnlyWithAttachments = depth === 0 && !showAllMessages;

		if (messages && messages.length) {
			let last: number = null;

			for (const message of messages) {
				if (needOnlyWithAttachments && (!message.attachments || !message.attachments.length)) {
					continue;
				}

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
				} else {
					list.push(
						<div key={-Math.floor(Math.random() * 100000)} />
					);
				}

				list.push(
					<Message
						key={`msg${message.id || -Math.floor(Math.random() * 100000)}`}
						users={users}
						message={message}
						depth={depth} />
				);
			}
		}

		if (!list.length) {
			const warn = needOnlyWithAttachments
				? 'За этот период нет сообщений с прикреплениями'
				: 'За этот период нет сообщений';

			return <div className="messagelist-info">{warn}</div>;
		}

		return <div className="messagelist-list">{list}</div>;
	}
}
