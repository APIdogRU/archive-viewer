import * as React from 'react';

import { cnPeriodPanel } from '../PeriodPanel.const';
import type { IPeriodPanelItemProps } from './PeriodPanel-Item.typings';
import { periodPanelItemCountCn, periodPanelItemTitleCn } from './PeriodPanel-Item.const';

import './PeriodPanel-Item.scss';

export const PeriodPanelItem: React.FC<IPeriodPanelItemProps> = ({ period, setPeriod, active }) => {
    const onClick = React.useCallback((event: React.MouseEvent) => {
        event.preventDefault();

        setPeriod(period);
    }, [setPeriod, period]);

    return (
        <li className={cnPeriodPanel('Item', { active })}>
            <a href={`#year=${period.year}&month=${period.month}`} onClick={onClick}>
                <span className={periodPanelItemTitleCn}>{period.month + 1}/{period.year}</span>
                <span className={periodPanelItemCountCn}>{period.count}</span>
            </a>
        </li>
    );
};
