import * as React from 'react';

import { PeriodPanelItem } from './-Item/PeriodPanel-Item';
import { periodPanelCn } from './PeriodPanel.const';
import type { IPeriodPanelProps } from './PeriodPanel.typings';

import './PeriodPanel.scss';

export const PeriodPanel: React.FC<IPeriodPanelProps> = ({ periods, current, setPeriod }) => (
    <ul className={periodPanelCn}>
        {periods.map(period => (
            <PeriodPanelItem
                key={`${period.year}_${period.month}`}
                period={period}
                setPeriod={setPeriod}
                active={period === current} />
        ))}
    </ul>
);
