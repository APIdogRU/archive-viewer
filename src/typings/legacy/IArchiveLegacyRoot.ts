import type { IArchiveLegacyMessage } from './IArchiveLegacyMessage';
import type { IArchiveLegacyMeta } from './IArchiveLegacyMeta';

export interface IArchiveLegacyRoot {
    meta: IArchiveLegacyMeta;
    data: IArchiveLegacyMessage[];
}
