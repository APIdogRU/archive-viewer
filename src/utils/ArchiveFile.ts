import { IVKUser, IVKMessage } from '@apidog/vk-typings';
import { Array as SArray } from 'sugar';
import { stringify } from 'querystring';
import { IArchiveRoot, IArchiveMeta } from '../typings/types';

export default class ArchiveFile {
	private readonly file?: File;
	private content?: IArchiveRoot;

	constructor(file: File) {
		this.file = file;
	}

	public read = async(): Promise<void> => new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			const text = reader.result as string;
			const json: IArchiveRoot = JSON.parse(text);
			console.log('Read complete successfully');

			this.content = json;

			if (!(json.meta && json.meta.v && json.data && Array.isArray(json.data))) {
				reject({ message: 'Неизвестный формат архива.' });
				return;
			}

			resolve();
		};

		reader.onerror = error => reject(error);

		reader.readAsText(this.file);
		console.log('Reading file...');
	});

	public getMeta = () => {
		if (!this.content) {
			throw new Error('Not parsed');
		}

		return this.content.meta;
	};

	public getData = () => {
		if (!this.content) {
			throw new Error('Not parsed');
		}

		return this.content.data;
	};

	public fetchUserInfo = async(): Promise<IVKUser[]> => {
		if (!this.content) {
			throw new Error('Not parsed');
		}

		console.log('Fetching users info');

		const collectUsers = (userIds: Set<number>, message: IVKMessage) => {
			userIds.add(message.from_id);

			if (message.fwd_messages) {
				message.fwd_messages.reduce(collectUsers, userIds);
			}

			return userIds;
		};

		const userIds = this.content.data.reduce(collectUsers, new Set());

		const s = SArray.inGroupsOf(Array.from(userIds), 100) as unknown as number[][];
		const groups = s.map((a: number[]) => SArray.compact(a));

		const res = await fetch('https://apidog.ru/archive-viewer/getUsers.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: stringify({
				userIds: groups[0].join(","), // TODO
			})
		});
		
		const { response } = await res.json();
		console.log('User info fetched');

		return response;
	}
}
