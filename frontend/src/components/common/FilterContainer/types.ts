export interface FilterOption {
    id: string;
    label: string;
    value: string | number | boolean;
}

export interface FilterGroup {
    id: string;
    label: string;
    options: FilterOption[];
    type: 'checkbox' | 'radio' | 'select' | 'date' | 'range';
}

export interface FilterState {
    [key: string]: string | number | boolean | (string | number | boolean)[];
}

export interface FilterContainerProps {
    filters: FilterGroup[];
    onFilterChange: (filters: FilterState) => void;
    onReset?: () => void;
    isLoading?: boolean;
}