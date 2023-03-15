import * as React from 'react';

import type { IPeriodInfo } from '@typings/IPeriodInfo';

import './PeriodItem.scss';

interface IPeriodItemProps {
    period: IPeriodInfo;
    setPeriod: (period: IPeriodInfo) => void;
    active: boolean;
}

export const PeriodItem: React.FC<IPeriodItemProps> = ({ period, setPeriod, active }) => {
    const onClick = React.useCallback((event: React.MouseEvent) => {
        event.preventDefault();

        setPeriod(period);
    }, [setPeriod, period]);

    return (
        <li className={`PeriodPanel-Item ${active && 'PeriodPanel-Item_active'}`}>
            <a href={`#year=${period.year}&month=${period.month}`} onClick={onClick}>
                <span className="PeriodPanel-ItemTitle">{period.month + 1}/{period.year}</span>
                <span className="PeriodPanel-ItemCount">{period.count}</span>
            </a>
        </li>
    );
};
