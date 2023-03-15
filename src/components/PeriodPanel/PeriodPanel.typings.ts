import type { IPeriodInfo } from '@typings/IPeriodInfo';

export interface IPeriodPanelProps {
    current: IPeriodInfo | undefined;
    periods: IPeriodInfo[];
    setPeriod: (period: IPeriodInfo) => void;
}
