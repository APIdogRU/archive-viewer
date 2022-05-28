import * as React from 'react';

import type { IPeriodInfo } from '@typings/IPeriodInfo';

import { PeriodItem } from './PeriodPanel.components/PeriodItem/PeriodItem';

import './PeriodPanel.scss';

interface IPeriodPanelProps {
    current: IPeriodInfo | undefined;
    periods: IPeriodInfo[];
    setPeriod: (period: IPeriodInfo) => void;
}

export const PeriodPanel: React.FC<IPeriodPanelProps> = ({ periods, current, setPeriod }) => (
    <ul className="PeriodPanel">
        {periods.map(period => (
            <PeriodItem
                key={`${period.year}_${period.month}`}
                period={period}
                setPeriod={setPeriod}
                active={period === current} />
        ))}
    </ul>
);
