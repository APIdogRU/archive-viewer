import * as React from 'react';

import './Icon.scss';

interface IIconProps {
    icon: string;
}

export const Icon: React.FC<IIconProps> = React.memo(props => (
    <svg
        className="Icon"
        viewBox="0 0 24 24"
        role="presentation"
    >
        <path d={props.icon} />
    </svg>
));
