import * as React from 'react';

import { Icon } from '@components/Icon/Icon';
import { iconOpenInNew, iconVk, iconDog } from '@components/Icon/icons';
import { getVK2APIdogLink } from '@utils/getVK2APIdogLink';

import type { ILinkCardProps } from './LinkCard.typings';
import {
    linkCardCn,
    linkCardAsideCn,
    linkCardTitleCn,
    titleAPIdog,
    titleVk,
} from './LinkCard.const';

import './LinkCard.scss';

export const LinkCard: React.FC<ILinkCardProps> = ({ title, icon, href, external }) => (
    <div className={linkCardCn}>
        <Icon icon={icon} />
        <div className={linkCardTitleCn}>{title}</div>
        <div className={linkCardAsideCn}>
            {external ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer">
                    <Icon icon={iconOpenInNew} />
                </a>
            ) : (
                <>
                    <a
                        href={`https://vk.com/${href}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={titleVk}
                    >
                        <Icon icon={iconVk} />
                    </a>
                    <a
                        href={getVK2APIdogLink(href)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={titleAPIdog}
                    >
                        <Icon icon={iconDog} />
                    </a>
                </>
            )}
        </div>
    </div>
);
