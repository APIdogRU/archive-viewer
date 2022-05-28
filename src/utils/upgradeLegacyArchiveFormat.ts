import type { IAttachment, IAudio, IDocument, IMessage, ISticker, IVideo } from '@apidog/vk-typings';
import type { IArchiveData } from '@typings/IArchiveData';
import type { IArchiveMeta } from '@typings/IArchiveMeta';
import type { IArchiveRoot } from '@typings/IArchiveRoot';
import type { IArchiveLegacyAttachment } from '@typings/legacy/IArchiveLegacyAttachment';
import type { IArchiveLegacyMessage } from '@typings/legacy/IArchiveLegacyMessage';
import type { IArchiveLegacyMeta } from '@typings/legacy/IArchiveLegacyMeta';
import type { IArchiveLegacyRoot } from '@typings/legacy/IArchiveLegacyRoot';

// Базовая дата для версии v1
const d2006 = 1138741200;

const fixDate = (d: number) => d2006 + d;

function convertMeta(meta: IArchiveLegacyMeta): IArchiveMeta {
    const [firstName, lastName] = meta.t.split(' ', 2);

    return {
        v: '2.0',
        peer: meta.p,
        ownerId: meta.a,
        owner: { firstName, lastName },
        d: meta.d,
    };
};

function convertAttachment(attach: IArchiveLegacyAttachment): IAttachment | undefined {
    switch (attach.t) {
        case 4: {
            return {
                type: 'sticker',
                sticker: {
                    sticker_id: attach.i,
                    images: [
                        {
                            url: `https://vk.com/sticker/1-${attach.i}-128`,
                            width: 128,
                            height: 128
                        },
                    ],
                } as ISticker,
            };
        }

        case 3: {
            return {
                type: 'doc',
                doc: {
                    owner_id: attach.o,
                    id: attach.i,
                    title: attach.n,
                    ext: attach.e,
                    size: attach.s
                } as IDocument,
            };
        }

        case 2: {
            return {
                type: 'audio',
                audio: {
                    owner_id: attach.o,
                    id: attach.i,
                    artist: attach.a,
                    title: attach.n,
                    duration: attach.d,
                } as IAudio,
            };
        }

        case 1: {
            return {
                type: 'video',
                video: {
                    id: attach.i,
                    owner_id: attach.o,
                    title: attach.n,
                    duration: attach.s,
                    description: attach.z,
                    date: attach.d,
                } as IVideo,
            };
        }

        case 0: {
            return {
                type: 'photo',
                photo: {
                    // @ts-ignore
                    src_thumb: attach.s.t || attach.s.o,
                    src_max: attach.s.m || attach.s.s || attach.s.n || attach.s.o,
                    description: attach.z,
                    lat: attach.q,
                    long: attach.w,
                    owner_id: attach.o,
                    id: attach.i,
                    date: fixDate(attach.d)
                },
            };
        }

        default: return undefined;
    }
}

const convertForwardedMessages = (meta: IArchiveMeta, fwdmsg: IArchiveLegacyMessage) => convertMessage(meta, fwdmsg);

function convertMessage(meta: IArchiveMeta, message: IArchiveLegacyMessage): IMessage {
    return {
        peer_id: meta.d,
        date: fixDate(message.d),
        from_id: message.f,
        text: message.t,
        id: message.i,
        out: message.f === meta.ownerId,
        attachments: message.a ? message.a.map(convertAttachment).filter(Boolean) as IAttachment[] : [],
        fwd_messages: message.m ? message.m.map(convertForwardedMessages.bind(null, meta)) : []
    };
};

export function upgradeLegacyArchiveFormat(archive: IArchiveLegacyRoot): IArchiveRoot {
    const meta: IArchiveMeta = convertMeta(archive.meta);
    const data: IArchiveData = archive.data.map(convertMessage.bind(null, meta));
    return { meta, data };
};
