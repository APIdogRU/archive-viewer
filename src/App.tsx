import * as React from 'react';
import { IVKMessage, IVKUser } from '@apidog/vk-typings';
import ArchiveFile from './utils/ArchiveFile';
import migration1to2 from './utils/migration1to2';
import { IHashDateMessage, IUserTable } from './typings/types';
import { IArchiveLegacyMeta, IArchiveLegacyMessage } from './typings/archive-legacy';
import MessageList from './components/MessageList';

export enum AppStage {
	SELECT_FILE,
	PARSING,
	VIEW,
	ATTACH_LIST
}

const APP_VERSION = process.env.VERSION;
const YEAR_RELEASE = 2019;

export type IAppProps = {};

export interface IAppState {
	stage: AppStage;
	showAllMessages: boolean;
	error: Error;

	all: IVKMessage[]; // все сообщения
	messages: IVKMessage[]; // сообщения для показа
	users?: IUserTable;
	query?: string; // поисковый запрос
	year?: number; // год
	month?: number; // месяц

	content: null;

	grouped?: IHashDateMessage;
}


export default class App extends React.Component<IAppProps, IAppState> {

	private static readonly months = 'январь февраль март апрель май июнь июль август сентябрь октябрь ноябрь декабрь'.split(' ');

	state: IAppState = {
		stage: AppStage.SELECT_FILE,
		showAllMessages: true,
		error: null,
		all: null, // все сообщения
		messages: null, // сообщения для показа
		year: null, // год
		month: null, // месяц
		content: null,
	};

	private generateGroups = (table: IHashDateMessage) =>
		(Object.keys(table) as unknown as number[]).map((year: number) =>
			(Object.keys(table[year]) as unknown as number[]).map((month: number) => (
				<option
					key={month}
					value={`${year}_${month}`}>
					{year} {App.months[month]} ({table[year][month].length})
				</option>
			)
		)
	);

	private onChangePeriod = (event: React.ChangeEvent<HTMLSelectElement>) => {
		if (!event.target.value) {
			return;
		}

		const [y, m]: number[] = event.target.value.split('_').map(Number);

		this.setState({
			month: m,
			year: y,
			messages: this.state.grouped[y][m].reverse(),
			query: ''
		});
	};

	private onChangeAllOrAttachments = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ showAllMessages: event.target.checked });
	};

	async onChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files[0];

		this.setState({
			stage: AppStage.PARSING
		});

		console.log('Loading file...');

		const af = new ArchiveFile(file);
		try {
			await af.read();
		} catch (e) {
			this.setState({
				error: e
			});
			return;
		}

		if (af.getMeta().v < '2.0') {
			console.log(`Detected deprecated version ${af.getMeta().v}. Trying to convert`);
			await migration1to2({
				meta: af.getMeta() as unknown as IArchiveLegacyMeta,
				data: af.getData() as unknown as IArchiveLegacyMessage[]
			});
			console.log('Converted to 2.0');
		}

		const rawUsers = await af.fetchUserInfo();

		const users = rawUsers.reduce((users: IUserTable, user: IVKUser) => {
			users[user.id] = user;
			return users;
		}, {});

		const fixMessages = (message: IVKMessage) => {
			if (message.reply_message) {
				(message.fwd_messages || (message.fwd_messages = [])).unshift(message.reply_message);
			}

			if (message.fwd_messages) {
				message.fwd_messages = message.fwd_messages.map(fixMessages);
			}

			return message;
		};

		const messages = af.getData().map(fixMessages);

		this.setState({
			stage: AppStage.VIEW,
			users,
			all: messages,
			messages: [],
			grouped: this.groupBy(messages)
		});
	}

	private groupBy = (messages: IVKMessage[]): IHashDateMessage => {
		const years: IHashDateMessage = {};

		const add = (message: IVKMessage) => {
			const date = new Date(message.date * 1000);
			const y = date.getFullYear();
			const m = date.getMonth();

			if (!(y in years)) {
				years[y] = {};
			}

			if (!(m in years[y])) {
				years[y][m] = [];
			}

			years[y][m].push(message);
		};

		messages.forEach(add);

		return years;
	};

	render() {
		const { error, stage } = this.state;

		if (error) {
			return <div className="app-overlay">
				<div className="app-paper">
					<h4>Произошла ошибка</h4>
					<p>{error.message}</p>
				</div>
			</div>;
		}

		switch (stage) {
			case AppStage.SELECT_FILE: {
				return (
					<div className="app">
						<div className="app-paper">
							<p>Выберите файл архива сообщений.</p>
							<input
								accept="application/json"
								className="app-input"
								id="contained-button-file"
								type="file"
								onChange={this.onChange} />
							<label
								htmlFor="contained-button-file"
								className="app-input__label">
								<button className="app-input__button">Выбрать JSON файл</button>
							</label>
							<p className="app-footer">APIdog &copy; {YEAR_RELEASE}<br />v{APP_VERSION}</p>
						</div>
					</div>
				);
			};

			case AppStage.PARSING: {
				return (
					<div className="app">
						{ /*<CircularProgress size={60} thickness={4} /> */ }
						<div className="app-paper">Пожалуйста, подождите...</div>
					</div>
				);
			};

			case AppStage.VIEW: {
				return (
					<React.Fragment>
						<div className="viewer-list">
							{this.state.year ? (
								<MessageList
									depth={0}
									showAllMessages={this.state.showAllMessages}
									messages={this.state.messages}
									users={this.state.users}
									query={this.state.query} />
							) : (
								<p>Выберите внизу период</p>
							)}
						</div>
						<div className="app-bar">
							<div className="app-period">
								<select
									value={`${this.state.year}_${this.state.month}`}
									onChange={this.onChangePeriod}
									name="period"
									id="__period">
									<option disabled value={""}>&lt; период не выбраны &gt;</option>
									{this.generateGroups(this.state.grouped)}
								</select>
							</div>
							<div>
								<label>
									<input
										type="checkbox"
										checked={this.state.showAllMessages}
										onChange={this.onChangeAllOrAttachments}
										value="allMessages" />
									Только с прикреплениями
								</label>
							</div>
						</div>
					</React.Fragment>
				);
			};

			default: {
				return <div>invalid stage</div>;
			};
		}
	}
}
