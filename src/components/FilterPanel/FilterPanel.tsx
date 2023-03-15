import * as React from 'react';

import type { FilterName } from '@components/ArchiveViewer/filters';
import { Checkbox } from '@components/Checkbox/Checkbox';

import type { IFilterPanelProps } from './FilterPanel.typings';
import { filterPanelCn } from './FilterPanel.const';

export const FilterPanel: React.FC<IFilterPanelProps> = React.memo(({ filters, selected, filterNames, setSelected }) => {
    const setChecked = function(filterKey: FilterName) {
        if (!selected.includes(filterKey)) {
            setSelected([...selected, filterKey]);
        } else {
            setSelected(selected.filter(filter => filter !== filterKey));
        }
    };
    return (
        <div className={filterPanelCn}>
            {filters.map(filterKey => (
                <Checkbox
                    key={filterKey}
                    label={filterNames[filterKey]}
                    name={String(filterKey)}
                    checked={selected.includes(filterKey)}
                    setChecked={setChecked.bind(null, filterKey)}
                />
            ))}
        </div>
    );
});
