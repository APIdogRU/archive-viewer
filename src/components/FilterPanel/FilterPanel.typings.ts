import type { FilterName } from '@components/ArchiveViewer/filters';

export interface IFilterPanelProps {
    filters: FilterName[];
    selected: FilterName[];
    filterNames: Record<FilterName, string>;
    setSelected: (filters: FilterName[]) => void;
}
