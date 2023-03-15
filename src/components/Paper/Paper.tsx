import * as React from 'react';

import type { IPaperProps } from './Paper.typings';
import {
    paperCn,
    paperContentCn,
    paperFooterCn,
    paperSubtitleCn,
    paperTitleCn,
} from './Paper.const';

import './Paper.scss';

export const Paper: React.FC<IPaperProps> = props => (
    <div className={paperCn}>
        <h1 className={paperTitleCn}>{props.title}</h1>
        {props.subtitle && <p className={paperSubtitleCn}>{props.subtitle}</p>}
        <div className={paperContentCn}>{props.children}</div>
        {props.footer && <p className={paperFooterCn}>{props.footer}</p>}
    </div>
);
