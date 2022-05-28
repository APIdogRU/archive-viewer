import * as React from 'react';
import type { IAudioMessage } from '@apidog/vk-typings';

import './AudioMessage.scss';

interface IAudioMessageProps {
    voice: IAudioMessage;
}

export const MessageAttachmentAudioMessage: React.FC<IAudioMessageProps> = ({ voice }) => (
    <audio controls className="VoiceMessage">
        <source src={voice.link_mp3} />
        <source src={voice.link_ogg} />
    </audio>
);
