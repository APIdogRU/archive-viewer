import * as React from 'react';

import type { IAvatarProps } from './Avatar.typings';
import { avatarImageCn, cnAvatar } from './Avatar.const';
import { getInitials } from './Avatar.utils/getInitials';

import './Avatar.scss';

export const Avatar: React.FC<IAvatarProps> = React.memo(({
    info,
    size,
    alt = '',
    className,
}) => {
    let photoUrl = info.photo_200 ?? info.photo_100 ?? info.photo_50;

    if (photoUrl?.includes('camera_')) {
        photoUrl = undefined;
    }

    const div = info.id % 6;

    const avatarCn = cnAvatar({
        size,
        type: photoUrl !== undefined ? 'image' : 'gradient',
        div: String(div),
    }, [className]);

    return (
        <div className={avatarCn} aria-hidden>
            {photoUrl !== undefined ? (
                <img
                    className={avatarImageCn}
                    src={photoUrl}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                />
            ) : getInitials(info)}
        </div>
    );
});
