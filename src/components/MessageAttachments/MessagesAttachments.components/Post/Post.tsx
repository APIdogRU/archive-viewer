import * as React from 'react';
import * as Sugar from 'sugar';
import type { IPost } from '@apidog/vk-typings';

import { LinkCard } from '@components/LinkCard/LinkCard';
import { iconWall } from '@components/Icon/icons';

interface IPostProps {
    post: IPost;
}

export const MessageAttachmentPost: React.FC<IPostProps> = ({ post }) => (
    <LinkCard
        href={`wall${post.owner_id || post.to_id || post.from_id}_${post.id}`}
        icon={iconWall}
        title={`Запись на стене «${Sugar.String.truncateOnWord(post.text, 60, undefined, '...')}»`} />
);
