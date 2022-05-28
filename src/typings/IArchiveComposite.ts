import type { IAccountMap } from './IAccountMap';
import type { IArchiveIndex } from './IArchiveIndex';
import type { IArchiveRoot } from './IArchiveRoot';

/**
 * Архив со всей требуемой информацией: архив, индексы, аккаунты
 */
export interface IArchiveComposite {
    archive: IArchiveRoot;
    index: IArchiveIndex;
    accounts: IAccountMap;
}
