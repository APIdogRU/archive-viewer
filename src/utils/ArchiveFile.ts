import type { IArchiveMeta, IArchiveRoot } from '@typings/types';
import type { IArchiveLegacy } from '@typings/archive-legacy';

export default class ArchiveFile {
    private readonly mFile?: File;
    private mRoot?: IArchiveRoot;

    public constructor(file: File) {
        this.mFile = file;
    }

    public read = async(): Promise<void> => new Promise((resolve, reject) => {
        if (!this.mFile) {
            reject();
            return;
        }

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
    public process = <Input extends IArchiveRoot | IArchiveLegacy>(handler: (input: Input) => IArchiveRoot) => {
        if (!this.mRoot) throw new Error('File not passed');

        this.mRoot = handler(this.mRoot as Input);
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
}
