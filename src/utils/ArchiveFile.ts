import { IVKUser, IVKMessage } from '@apidog/vk-typings';
import { Array as SArray } from 'sugar';
import { stringify } from 'querystring';
import { IArchiveRoot, IArchiveMeta, IArchiveData } from '../typings/types';
import { IArchiveLegacy } from '../typings/archive-legacy';

export default class ArchiveFile {
	private readonly mFile?: File;
	private mRoot?: IArchiveRoot;

	constructor(file: File) {
		this.mFile = file;
	}

	public read = async(): Promise<void> => new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			const text = reader.result as string;
			const json: IArchiveRoot = JSON.parse(text);
			console.log('Read complete successfully');

			this.mRoot = json;

			if (!(json.meta && json.meta.v && json.data && Array.isArray(json.data))) {
				reject({ message: 'Неизвестный формат архива.' });
				return;
			}

			resolve();
		};

		reader.onerror = error => reject(error);

		reader.readAsText(this.mFile);
		console.log('Reading file...');
	});

	/**
	 * Обработка данных архива функцией
	 * Например, для конвертации из старого формата
	 */
	public process = (handler: (input: IArchiveRoot | IArchiveLegacy) => IArchiveRoot) => {
		this.mRoot = handler(this.mRoot);
		return this.mRoot;
	}

	public get root(): IArchiveRoot {
		if (!this.mRoot) {
			throw new Error('Not parsed');
		}

		return this.mRoot;
	}

	public get meta(): IArchiveMeta {
		if (!this.mRoot) {
			throw new Error('Not parsed');
		}

		return this.mRoot.meta;
	}

	public get data(): IArchiveData {
		if (!this.mRoot) {
			throw new Error('Not parsed');
		}

		return this.mRoot.data;
	};

	public fetchUserInfo = async(): Promise<IVKUser[]> => {
		if (!this.mRoot) {
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

		const userIds = this.mRoot.data.reduce(collectUsers, new Set());

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
