import Icon from '@mdi/react';
import {
    mdiVkBox,
    mdiDogSide,
    mdiOpenInNew
} from '@mdi/js';
import * as React from 'react';
import './LinkCard.css';

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
                        <Icon path={mdiOpenInNew} size={1.5} />
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
                        <Icon path={mdiVkBox} size={1.5} />
                    </a>
                    <a
                        href={`https://apidog.ru/6.4/#${href}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Icon path={mdiDogSide} size={1.5} />
                    </a>
                </div>
            );
        }

        return (
            <div className="card">
                <Icon path={icon} size={1.5} />
                <div className="card-title">{title}</div>
                {content}
            </div>
        );
    }
}
