import * as React from 'react';
import type { ISticker } from '@apidog/vk-typings';

import './Sticker.scss';

interface IStickerProps {
    sticker: ISticker;
}

export const MessageAttachmentSticker: React.FC<IStickerProps> = ({ sticker }) => {
    const best = React.useMemo(() => {
        return sticker.images.reduce((best, current) => {
            const currentSize = Math.max(current.width, current.height);
            const bestSize = Math.max(best.width, best.height);
            return currentSize <= 128 && bestSize < currentSize ? current : best;
        }, sticker.images[0]);
    }, [sticker]);

    return (
        <img
            className="Sticker"
            src={best.url}
            alt="Sticker"
        />
    );
};
