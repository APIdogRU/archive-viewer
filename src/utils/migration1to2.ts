import { IAttachment } from '@apidog/vk-typings';
import { IArchiveMeta, IArchiveRoot, IArchiveData } from '../typings/types';
import {
    IArchiveLegacyMeta,
    IArchiveLegacyAttachment,
    IArchiveLegacy,
    IArchiveLegacyMessage
} from '../typings/archive-legacy';

// Базовая дата для версии v1
const d2006 = 1138741200;

const fixDate = (d: number) => d2006 + d;

const convertMeta = (meta: IArchiveLegacyMeta): IArchiveMeta => {
    const [firstName, lastName] = meta.t.split(' ', 2);

    return {
        v: '2.0',
        peer: meta.p,
        ownerId: meta.a,
        owner: { firstName, lastName },
        d: meta.d
    }
};

const convertAttachment = (attach: IArchiveLegacyAttachment): IAttachment<any> => {
    let type = null;
    let res = null;
    switch (attach.t) {
        case 4:
            type = 'sticker';
            res = {
                sticker_id: attach.i,
                images: [
                    {
                        url: `https://vk.com/sticker/1-${attach.i}-128`,
                        width: 128,
                        height: 128
                    }
                ]
            };
            break;

        case 3:
            type = 'doc';
            res = {
                owner_id: attach.o,
                id: attach.i,
                title: attach.n,
                ext: attach.e,
                size: attach.s
            };
            break;

        case 2:
            type = 'audio';
            res = {
                owner_id: attach.o,
                id: attach.i,
                artist: attach.a,
                title: attach.n,
                duration: attach.d
            };
            break;

        case 1:
            type = 'video';
            res = {
                id: attach.i,
                owner_id: attach.o,
                title: attach.n,
                duration: attach.s,
                description: attach.z,
                date: attach.d
            };
            break;

        case 0:
            type = 'photo';
            res = {
                src_thumb: attach.s.t || attach.s.o,
                src_max: attach.s.m || attach.s.s || attach.s.n || attach.s.o,
                description: attach.z,
                lat: attach.q,
                'long': attach.w,
                owner_id: attach.o,
                id: attach.i,
                date: fixDate(attach.d)
            };
            break;

        default:
    }

    return {type, [type]: res};
};

const convertForwardedMessages = (meta: IArchiveMeta, fwdmsg: IArchiveLegacyMessage) => convertMessage(meta, fwdmsg);

const convertMessage = (meta: IArchiveMeta, message: IArchiveLegacyMessage) => {
    return {
        date: fixDate(message.d),
        from_id: message.f,
        text: message.t,
        id: message.i,
        out: message.f === meta.ownerId,
        attachments: message.a ? message.a.map(convertAttachment) : [],
        fwd_messages: message.m ? message.m.map(convertForwardedMessages.bind(null, meta)) : []
    };
};

export default (archive: IArchiveLegacy): IArchiveRoot => {
    const meta: IArchiveMeta = convertMeta(archive.meta);
    const data: IArchiveData = archive.data.map(convertMessage.bind(null, meta));
    return { meta, data };
};
