import * as React from 'react';
import type { IPhoto } from '@apidog/vk-typings';

type IPatchedPhoto = IPhoto & { src_max: string, src_thumb: string };

interface IPhotoProps {
    photo: IPhoto;
}

export const MessageAttachmentPhoto: React.FC<IPhotoProps> = React.memo(({ photo }) => {
    let thumbnail: string = (photo as IPatchedPhoto).src_thumb;
    let original: string = (photo as IPatchedPhoto).src_max;

    if (photo.sizes) {
        const map = photo.sizes.reduce((map, size) => {
            return map.set(size.type, size.url);
        }, new Map<string, string>());

        thumbnail = map.get('m') ?? map.get('s')!;
        original = map.get('w') ?? map.get('z') ?? map.get('y') ?? map.get('x')!;
    }

    return (
        <a
            href={original}
            target="_blank"
            rel="noopener noreferrer">
            <img src={thumbnail} alt="Photo" />
        </a>
    );
}, (prev, next) => prev.photo.id === next.photo.id);
