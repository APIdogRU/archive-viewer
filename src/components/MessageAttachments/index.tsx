import * as React from 'react';
import * as Sugar from 'sugar';
import type {
    IAttachmentList,
    ISticker,
    IVideo,
    IAudio,
    IDocumentPreviewAudioMessage,
    IWall,
    ILink,
    IDocument,
    IPhoto
} from '@apidog/vk-typings';

import LinkCard from '@components/LinkCard';
import { iconVideo, iconMusic, iconWall, iconDocument, iconLink } from '@icons';

import './MessageAttachments.scss';

export type IMessageAttachmentsProps = {
    items: IAttachmentList;
};

const MessageAttachments: React.FC<IMessageAttachmentsProps> = (props: IMessageAttachmentsProps) => (
    <div className="message-attachments">
        {props.items.map((item, i) => {
            const { type } = item;

            let node;

            switch (type) {
                case 'sticker': {
                    const sticker = item.sticker as ISticker;
                    const best = sticker.images.reduce((best, current) => {
                        const currentSize = Math.max(current.width, current.height);
                        const bestSize = Math.max(best.width, best.height);
                        return currentSize <= 128 && bestSize < currentSize ? current : best;
                    }, sticker.images[0]);
                    node = (
                        <img
                            className="message-attachment__sticker"
                            src={best.url}
                            alt="Sticker" />
                    );
                    break;
                }

                case 'video': {
                    const video = item.video as IVideo;
                    node = (
                        <LinkCard
                            href={`video${video.owner_id}_${video.id}`}
                            icon={iconVideo}
                            title={`Видеозапись «${video.title}»`} />
                    );
                    break;
                }

                case 'audio': {
                    const audio = item.audio as IAudio;
                    node = (
                        <LinkCard
                            href={`audio${audio.owner_id}_${audio.id}`}
                            icon={iconMusic}
                            title={`Аудиозапись «${audio.artist} - ${audio.title}»`} />
                    );
                    break;
                }

                case 'audio_message': {
                    const voice = item.audio_message as IDocumentPreviewAudioMessage;
                    node = (
                        <audio controls className="message-attachment__audio-message">
                            <source src={voice.link_mp3} />
                            <source src={voice.link_ogg} />
                        </audio>
                    );
                    break;
                }

                case 'wall': {
                    const post = item.wall as IWall & { to_id: number };
                    node = (
                        <LinkCard
                            href={`wall${post.owner_id || post.to_id || post.from_id}_${post.id}`}
                            icon={iconWall}
                            title={`Запись на стене «${Sugar.String.truncateOnWord(post.text, 60, null, '...')}»`} />
                    );
                    break;
                }

                case 'doc': {
                    const doc = item.doc as IDocument;
                    node = (
                        <LinkCard
                            href={`doc${doc.owner_id}_${doc.id}`}
                            icon={iconDocument}
                            title={`Документ «${doc.title}»`} />
                    );
                    break;
                }

                case 'link': {
                    const link = item.link as ILink;
                    node = (
                        <LinkCard
                            href={link.url}
                            icon={iconLink}
                            external
                            title={`Ссылка «${link.title}»`} />
                    );
                    break;
                }

                case 'photo': {
                    const photo = item.photo as IPhoto & { src_max: string, src_thumb: string };
                    let thumbnail: string = photo.src_thumb;
                    let original: string = photo.src_max;

                    if (photo.sizes) {
                        const map = photo.sizes.reduce((map, size) => {
                            return map.set(size.type, size.url);
                        }, new Map<string, string>());

                        thumbnail = map.get('m') ?? map.get('s')!;
                        original = map.get('w') ?? map.get('z') ?? map.get('y') ?? map.get('x')!;
                    }

                    node = (
                        <a
                            href={original}
                            target="_blank"
                            rel="noopener noreferrer">
                            <img src={thumbnail} alt="p" />
                        </a>
                    );
                    break;
                }

                default: {
                    node = (<p>unknown attachment type = {type}</p>);
                }
            }

            return <div key={i}>{node}</div>;
        })}
    </div>
);

export default MessageAttachments;
