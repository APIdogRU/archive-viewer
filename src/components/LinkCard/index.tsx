import * as React from 'react';
import './LinkCard.css';
import { Icon, iconOpenInNew, iconVk, iconDog } from '../../icons';

export type ILinkCardProps = {
    href: string;
    icon: string;
    title: string;
    external?: boolean;
};

const LinkCard: React.FC<ILinkCardProps> = ({ title, icon, href, external }: ILinkCardProps) => (
    <div className='card'>
        <Icon icon={icon} />
        <div className='card-title'>{title}</div>
        {external
            ? (
                <div className='card-aside'>
                    <a
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'>
                        <Icon icon={iconOpenInNew} />
                    </a>
                </div>
            )
            : (
                <div className='card-aside'>
                    <a
                        href={`https://vk.com/${href}`}
                        target='_blank'
                        rel='noopener noreferrer'>
                        <Icon icon={iconVk} />
                    </a>
                    <a
                        href={`https://apidog.ru/6.6/#${href}`}
                        target='_blank'
                        rel='noopener noreferrer'>
                        <Icon icon={iconDog} />
                    </a>
                </div>
            )
        }
    </div>
);

export default LinkCard;
