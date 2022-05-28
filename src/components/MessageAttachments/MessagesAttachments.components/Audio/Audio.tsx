import * as React from 'react';
import type { IAudio } from '@apidog/vk-typings';

import { LinkCard } from '@components/LinkCard/LinkCard';
import { iconMusic } from '@components/Icon/icons';

interface IAudioProps {
    audio: IAudio;
}

export const MessageAttachmentAudio: React.FC<IAudioProps> = ({ audio }) => (
    <LinkCard
        href={`audio${audio.owner_id}_${audio.id}`}
        icon={iconMusic}
        title={`Аудиозапись «${audio.artist} - ${audio.title}»`}
    />
);
