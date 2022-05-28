import * as React from 'react';
import type { ILink } from '@apidog/vk-typings';

import { LinkCard } from '@components/LinkCard/LinkCard';
import { iconLink } from '@components/Icon/icons';

interface ILinkProps {
    link: ILink;
}

export const MessageAttachmentLink: React.FC<ILinkProps> = ({ link }) => (
    <LinkCard
        href={link.url}
        icon={iconLink}
        external
        title={`Ссылка «${link.title}»`}
    />
);
