export interface IArchiveLegacy {
    meta: IArchiveLegacyMeta;
    data: IArchiveLegacyMessage[];
}

export interface IArchiveLegacyMeta {
    t: string;
    p: number;
    d: number
    a: number;
}

export interface IArchiveLegacyMessage {
    d: number;
    f: number;
    t: string;
    i: number;
    a?: IArchiveLegacyAttachment[];
    m?: IArchiveLegacyMessage[];
}

export interface IArchiveLegacyAttachment extends Record<string, any> {
    t: number;
}
