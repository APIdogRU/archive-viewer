import * as React from 'react';
import { IVKMessage, IVKUser } from '@apidog/vk-typings';
import ArchiveFile from './utils/ArchiveFile';
import migration1to2 from './utils/migration1to2';
import { IHashDateMessage, IUserTable } from './typings/types';
import { IArchiveLegacyMeta, IArchiveLegacyMessage } from './typings/archive-legacy';
import MessageList from './components/MessageList';
import FileChooser from './components/FileChooser';
import LoadSpinner from './components/LoadSpinner';

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

	private generateGroups = (table: IHashDateMessage) => {
		const nodes = [];

		const years = Object.keys(table) as unknown as number[];
		const current = `${this.state.year}_${this.state.month}`;

		for (const year of years) {
			const months = Object.keys(table[year]) as unknown as number[];

			nodes.push(
				<div
					key={year}
					className="viewer-period-year">
					{year}
				</div>
			);

			for (const month of months) {
				const id = `${year}_${month}`;
				let cls = ['viewer-period-item'];

				if (current === id) {
					cls.push('viewer-period-item__active');
				}

				nodes.push(
					<div
						key={month}
						className={cls.join(' ')}
						onClick={this.onChangePeriod}
						data-count={table[year][month].length}
						data-period={id}>
						{App.months[month]}
					</div>
				);
			}
		}

		return nodes;
	};

	private onChangePeriod = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const value = (event.target as HTMLDivElement).dataset.period;
		const [y, m]: number[] = value.split('_').map(Number);

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

	private onFileChoosed = async(file: File) => {

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
			return (
				<div className="app app-page__error">
					<div className="app-paper">
						<h1>Произошла ошибка</h1>
						<p>{error.message}</p>
					</div>
				</div>
			);
		}

		switch (stage) {
			case AppStage.SELECT_FILE: {
				return (
					<div className="app app-page__select">
						<div className="app-paper">
							<h1>APIdog Archive Viewer</h1>
							<p>Выберите файл архива сообщений.</p>
							<FileChooser
								label="Выбрать JSON-файл"
								onChoose={this.onFileChoosed} />
							<p className="app-footer">APIdog &copy; {YEAR_RELEASE}<br />v{APP_VERSION}</p>
						</div>
					</div>
				);
			};

			case AppStage.PARSING: {
				return (
					<div className="app app-page__parsing">
						<div className="app-paper">
							<LoadSpinner />
							<p>Пожалуйста, подождите...</p>
						</div>
					</div>
				);
			};

			case AppStage.VIEW: {
				return (
					<div className="app-page__view viewer">
						<div className="viewer-content">
							<div className="viewer-period">
								{this.generateGroups(this.state.grouped)}
							</div>
							<div className="viewer-list">
								{this.state.year ? (
									<MessageList
										depth={0}
										showAllMessages={this.state.showAllMessages}
										messages={this.state.messages}
										users={this.state.users}
										query={this.state.query} />
								) : (
									<p>Выберите период</p>
								)}
							</div>
						</div>
						<div className="viewer-controls">
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
				);
			};

			default: {
				return (
					<div className="app app-page__error">
						<p>invalid stage</p>
					</div>
				);
			};
		}
	}
}
