import * as React from 'react';
import type { IVideo } from '@apidog/vk-typings';

import { LinkCard } from '@components/LinkCard/LinkCard';
import { iconVideo } from '@components/Icon/icons';

interface IVideoProps {
    video: IVideo;
}

export const MessageAttachmentVideo: React.FC<IVideoProps> = ({ video }) => (
    <LinkCard
        href={`video${video.owner_id}_${video.id}`}
        icon={iconVideo}
        title={`Видеозапись «${video.title}»`}
    />
);
