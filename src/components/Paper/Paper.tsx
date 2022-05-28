import * as React from 'react';

import './Paper.scss';

type IPaperProps = React.PropsWithChildren<{
    title: string;
    subtitle?: string;
    footer?: string;
}>;

export const Paper: React.FC<IPaperProps> = props => {
    return (
        <div className="Paper">
            <h1 className="Paper-Title">{props.title}</h1>
            {props.subtitle && <p className="Paper-Subtitle">{props.subtitle}</p>}
            <div className="Paper-Content">{props.children}</div>
            {props.footer && <p className="Paper-Footer">{props.footer}</p>}
        </div>
    );
};
