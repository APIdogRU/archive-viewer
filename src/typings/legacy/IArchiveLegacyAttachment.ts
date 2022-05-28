interface IArchiveLegacyAttachmentBase<I extends number> {
    t: I;
}

interface IArchiveLegacyAttachmentSticker extends IArchiveLegacyAttachmentBase<4> {
    i: number;
}

interface IArchiveLegacyAttachmentDocument extends IArchiveLegacyAttachmentBase<3> {
    o: number; // owner_id
    i: number; // document_id
    n: string; // title
    e: string; // ext
    s: number; // size
}

interface IArchiveLegacyAttachmentAudio extends IArchiveLegacyAttachmentBase<2> {
    o: number; // owner_id
    i: number; // audio_id
    a: string; // artist
    n: string; // title
    d: number; // duration
}

interface IArchiveLegacyAttachmentVideo extends IArchiveLegacyAttachmentBase<1> {
    o: number; // owner_id
    i: number; // video_id
    n: string; // title
    s: number; // duration
    z: string; // description
    d: number; // date
}

interface IArchiveLegacyAttachmentPhoto extends IArchiveLegacyAttachmentBase<0> {
    o: number; // owner_id
    i: number; // photo_id
    s: Record<'t' | 'o' | 'm' | 's' | 'n', string>; // sizes
    z: string; // description
    q?: number; // latitude
    w?: number; // longitude
    d: number; // date
}

export type IArchiveLegacyAttachment =
    | IArchiveLegacyAttachmentPhoto
    | IArchiveLegacyAttachmentVideo
    | IArchiveLegacyAttachmentAudio
    | IArchiveLegacyAttachmentDocument
    | IArchiveLegacyAttachmentSticker;