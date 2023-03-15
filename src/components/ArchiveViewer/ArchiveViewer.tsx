import * as React from 'react';

import type { IPeriodInfo } from '@typings/IPeriodInfo';
import { PeriodPanel } from '@components/PeriodPanel/PeriodPanel';
import { MessageList } from '@components/MessageList/MessageList';
import { FilterPanel } from '@components/FilterPanel/FilterPanel';

import { FilterName, filterNames, filterImpl, allFilters } from './filters';
import {
    archiveViewerCn,
    archiveViewerContentCn,
    archiveViewerFilterCn,
    archiveViewerPeriodCn,
} from './ArchiveViewer.const';
import type { IArchiveViewerProps } from './ArchiveViewer.typings';

import './ArchiveViewer.scss';

export const ArchiveViewer: React.FC<IArchiveViewerProps> = ({ archive, accounts, index }) => {
    const [period, setPeriod] = React.useState<IPeriodInfo | undefined>(undefined);

    const [filters, setFilters] = React.useState<FilterName[]>([]);

    const messagesByPeriod = React.useMemo(
        () => period ? archive.data.slice(period.range[0], period.range[1]) : undefined,
        [period],
    );

    const messages = React.useMemo(() => {
        if (!messagesByPeriod) return;

        let messages = [...messagesByPeriod];
        for (const filterName of filters) {
            const filter = filterImpl[filterName];

            messages = messages.filter(message => filter(message));
        }
        return messages;
    }, [messagesByPeriod, filters]);

    return (
        <div className={archiveViewerCn}>
            <div className={archiveViewerPeriodCn}>
                <PeriodPanel
                    current={period}
                    periods={index.periods}
                    setPeriod={setPeriod}
                />
            </div>
            <div className={archiveViewerContentCn}>
                {messages ? (
                    <MessageList
                        messages={messages}
                        accounts={accounts}
                    />
                ) : 'Выберите промежуток'}
            </div>
            <div className={archiveViewerFilterCn}>
                <FilterPanel
                    filters={allFilters}
                    filterNames={filterNames}
                    selected={filters}
                    setSelected={setFilters}
                />
            </div>
        </div>
    );
};
