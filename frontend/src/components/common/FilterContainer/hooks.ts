import { useState, useCallback, useMemo } from 'react';

export interface FilterState {
    [key: string]: string | number | boolean | string[];
}

export const useFilterState = (initialFilters: FilterState = {}) => {
    const [filters, setFilters] = useState<FilterState>(initialFilters);

    const updateFilter = useCallback((key: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const setMultipleFilters = useCallback((newFilters: Partial<FilterState>) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
        }));
    }, []);

    return { filters, updateFilter, clearFilters, setMultipleFilters };
};

export const useFilteredData = <T,>(data: T[], filters: FilterState, filterFn: (item: T, filters: FilterState) => boolean) => {
    return useMemo(() => {
        return data.filter((item) => filterFn(item, filters));
    }, [data, filters, filterFn]);
};