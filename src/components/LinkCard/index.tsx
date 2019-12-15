import * as React from 'react';
import './LinkCard.css';
import { Icon, iconOpenInNew, iconVk, iconDog } from '../../icons';

export interface ILinkCardProps {
    href: string;
    icon: string;
    title: string;
}

export default class LinkCard extends React.Component<ILinkCardProps> {
    render() {
        const { title, icon, href } = this.props;

        const isExternal = href.indexOf("~") === 0;
        let content;

        if (isExternal) {
            content = (
                <div className="card-aside">
                    <a
                        href={href.substring(1)}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Icon icon={iconOpenInNew} />
                    </a>
                </div>
            );
        } else {
            content = (
                <div className="card-aside">
                    <a
                        href={`https://vk.com/${href}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Icon icon={iconVk}  />
                    </a>
                    <a
                        href={`https://apidog.ru/6.4/#${href}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Icon icon={iconDog} />
                    </a>
                </div>
            );
        }

        return (
            <div className="card">
                <Icon icon={icon} />
                <div className="card-title">{title}</div>
                {content}
            </div>
        );
    }
}
