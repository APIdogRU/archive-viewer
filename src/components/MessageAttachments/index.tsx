import * as React from 'react';
import LinkCard from '../LinkCard';
import * as Sugar from 'sugar';
import {
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
import './MessageAttachments.scss';
import { iconVideo, iconMusic, iconWall, iconDocument, iconLink } from '../../icons';

export interface IMessageAttachmentsProps {
    items: IAttachmentList;
}

export default class MessageAttachments extends React.Component<IMessageAttachmentsProps> {
    render() {
        return (
            <React.Fragment>
                {this.props.items.map((item, i) => {
                    const { type } = item;

                    let node = null;

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
                        };

                        case 'video': {
                            const video = item.video as IVideo;
                            node = (
                                <LinkCard
                                    href={`video${video.owner_id}_${video.id}`}
                                    icon={iconVideo}
                                    title={`Видеозапись «${video.title}»`} />
                            );
                            break;
                        };

                        case 'audio': {
                            const audio = item.audio as IAudio;
                            node = (
                                <LinkCard
                                    href={`audio${audio.owner_id}_${audio.id}`}
                                    icon={iconMusic}
                                    title={`Аудиозапись «${audio.artist} - ${audio.title}»`} />
                            );
                            break;
                        };

                        case 'audio_message': {
                            const voice = item.audio_message as IDocumentPreviewAudioMessage;
                            node = (
                                <audio controls className="message-attachment__audio-message">
                                    <source src={voice.link_mp3} />
                                    <source src={voice.link_ogg} />
                                </audio>
                            );
                            break;
                        };

                        case 'wall': {
                            const post = item.wall as IWall & { to_id: number };
                            node = (
                                <LinkCard
                                    href={`wall${post.owner_id || post.to_id || post.from_id}_${post.id}`}
                                    icon={iconWall}
                                    title={`Запись на стене «${Sugar.String.truncateOnWord(post.text, 60, null, '...')}»`} />
                            );
                            break;
                        };

                        case 'doc': {
                            const doc = item.doc as IDocument;
                            node = (
                                <LinkCard
                                    href={`doc${doc.owner_id}_${doc.id}`}
                                    icon={iconDocument}
                                    title={`Документ «${doc.title}»`} />
                            );
                            break;
                        };

                        case 'link': {
                            const link = item.link as ILink;
                            node = (
                                <LinkCard
                                    href={`~${link.url}`}
                                    icon={iconLink}
                                    title={`Ссылка «${link.title}»`} />
                            );
                            break;
                        };

                        case 'photo': {
                            const photo = item.photo as IPhoto & { src_max: string, src_thumb: string };
                            node = (
                                <a
                                    href={photo.src_max}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <img src={photo.src_thumb} alt="p" />
                                </a>
                            );
                            break;
                        };

                        default: {
                            node = (<p>unknown attachment type = {type}</p>);
                        }
                    }

                    return <div key={i} className="message-attachments">{node}</div>;
                })}
            </React.Fragment>
        );
    }
}
