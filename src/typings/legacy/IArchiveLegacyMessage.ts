import type { IArchiveLegacyAttachment } from './IArchiveLegacyAttachment';

export interface IArchiveLegacyMessage {
    d: number;
    f: number;
    t: string;
    i: number;
    a?: IArchiveLegacyAttachment[];
    m?: IArchiveLegacyMessage[];
}
