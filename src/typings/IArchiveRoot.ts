import type { IArchiveData } from './IArchiveData';
import type { IArchiveMeta } from './IArchiveMeta';

export interface IArchiveRoot {
    meta: IArchiveMeta;
    data: IArchiveData;
}
