import * as React from 'react';

import type { IArchiveComposite } from '@typings/IArchiveComposite';
import type { IPeriodInfo } from '@typings/IPeriodInfo';
import { PeriodPanel } from '@components/PeriodPanel/PeriodPanel';
import { MessageList } from '@components/MessageList/MessageList';

import { FilterPanel } from './ArchiveViewer.components/FilterPanel/FilterPanel';
import { FilterName, filterNames, fitlerImpl, allFilters } from './filters';

import './ArchiveViewer.scss';

type IArchiveViewerProps = IArchiveComposite;

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
            const filter = fitlerImpl[filterName];

            messages = messages.filter(message => filter(message));
        }
        return messages;
    }, [messagesByPeriod, filters]);

    return (
        <div className="Viewer">
            <div className="Viewer-Period">
                <PeriodPanel
                    current={period}
                    periods={index.periods}
                    setPeriod={setPeriod}
                />
            </div>
            <div className="Viewer-Content">
                {messages ? (
                    <MessageList
                        messages={messages}
                        accounts={accounts}
                    />
                ) : 'Выберите промежуток'}
            </div>
            <div className="Viewer-Filter">
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
