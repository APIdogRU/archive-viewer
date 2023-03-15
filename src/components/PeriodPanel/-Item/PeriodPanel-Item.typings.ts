import type { IPeriodInfo } from '@typings/IPeriodInfo';

export interface IPeriodPanelItemProps {
    period: IPeriodInfo;
    setPeriod: (period: IPeriodInfo) => void;
    active: boolean;
}
