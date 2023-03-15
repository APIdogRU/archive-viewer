import * as React from 'react';

import type { IIconProps } from './Icon.typings';
import { iconCn } from './Icon.const';

import './Icon.scss';

export const Icon: React.FC<IIconProps> = React.memo(props => (
    <svg
        className={iconCn}
        viewBox="0 0 24 24"
        role="presentation"
    >
        <path d={props.icon} />
    </svg>
));
