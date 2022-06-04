import * as React from 'react';
import { FilterName } from '@components/ArchiveViewer/filters';
import { Checkbox } from '@components/Checkbox/Checkbox';

interface IFilterPanelProps {
    filters: FilterName[];
    selected: FilterName[];
    filterNames: Record<FilterName, string>;
    setSelected: (filters: FilterName[]) => void;
}

export const FilterPanel: React.FC<IFilterPanelProps> = React.memo(({ filters, selected, filterNames, setSelected }) => {
    const setChecked = function(filterKey: FilterName) {
        if (!selected.includes(filterKey)) {
            setSelected([...selected, filterKey]);
        } else {
            setSelected(selected.filter(filter => filter !== filterKey));
        }
    };
    return (
        <div className="FilterPanel">
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
