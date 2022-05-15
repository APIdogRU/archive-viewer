import * as React from 'react';

import './style.scss';

export type IIconProps = {
    icon: string;
};

export const Icon: React.FC<IIconProps> = (props: IIconProps) => (
    <svg
        className='mdicon'
        viewBox='0 0 24 24'
        role='presentation'>
        <path d={props.icon} />
    </svg>
);
