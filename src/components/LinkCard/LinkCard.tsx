import * as React from 'react';

import { Icon } from '@components/Icon/Icon';
import { iconOpenInNew, iconVk, iconDog } from '@components/Icon/icons';
import { getVK2APIdogLink } from '@utils/getVK2APIdogLink';

import './LinkCard.scss';

export interface ILinkCardProps {
    href: string;
    icon: string;
    title: string;
    external?: boolean;
}

const titleVk = 'Открыть во ВКонтакте';
const titleAPIdog = 'Открыть в APIdog';

export const LinkCard: React.FC<ILinkCardProps> = ({ title, icon, href, external }) => (
    <div className="LinkCard">
        <Icon icon={icon} />
        <div className="LinkCard-Title">{title}</div>
        <div className="LinkCard-Aside">
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
