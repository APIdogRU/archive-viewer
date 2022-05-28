import * as React from 'react';
import type { IDocument } from '@apidog/vk-typings';

import { LinkCard } from '@components/LinkCard/LinkCard';
import { iconDocument } from '@components/Icon/icons';

interface IDocumentProps {
    document: IDocument;
}

export const MessageAttachmentDocument: React.FC<IDocumentProps> = ({ document }) => (
    <LinkCard
        href={`doc${document.owner_id}_${document.id}`}
        icon={iconDocument}
        title={`Документ «${document.title}»`}
    />
);
