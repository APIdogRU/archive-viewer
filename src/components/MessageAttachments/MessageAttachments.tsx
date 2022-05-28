import * as React from 'react';
import type { IAttachments } from '@apidog/vk-typings';

import { MessageAttachmentPhoto } from './MessagesAttachments.components/Photo/Photo';
import { MessageAttachmentLink } from './MessagesAttachments.components/Link/Link';
import { MessageAttachmentVideo } from './MessagesAttachments.components/Video/Video';
import { MessageAttachmentAudio } from './MessagesAttachments.components/Audio/Audio';
import { MessageAttachmentDocument } from './MessagesAttachments.components/Document/Document';
import { MessageAttachmentPost } from './MessagesAttachments.components/Post/Post';
import { MessageAttachmentSticker } from './MessagesAttachments.components/Sticker/Sticker';
import { MessageAttachmentAudioMessage } from './MessagesAttachments.components/AudioMessage/AudioMessage';

import './MessageAttachments.scss';

interface IMessageAttachmentsProps {
    items: IAttachments;
}

export const MessageAttachments: React.FC<IMessageAttachmentsProps> = React.memo(props => (
    <div className="Message-Attachments">
        {props.items.map((item, i) => {
            switch (item.type) {
                case 'sticker': {
                    return <MessageAttachmentSticker key={i} sticker={item.sticker} />
                }

                case 'video': {
                    return <MessageAttachmentVideo key={i} video={item.video} />
                }

                case 'audio': {
                    return <MessageAttachmentAudio key={i} audio={item.audio} />
                }

                case 'audio_message': {
                    return <MessageAttachmentAudioMessage key={i} voice={item.audio_message} />
                }

                case 'wall': {
                    return <MessageAttachmentPost key={i} post={item.wall} />
                }

                case 'doc': {
                    return <MessageAttachmentDocument key={i} document={item.doc} />
                }

                case 'link': {
                    return <MessageAttachmentLink key={i} link={item.link} />
                }

                case 'photo': {
                    return <MessageAttachmentPhoto key={i} photo={item.photo} />;
                }

                default: {
                    return <p key={i}>unknown attachment type = {item.type}</p>;
                }
            }
        })}
    </div>
));
