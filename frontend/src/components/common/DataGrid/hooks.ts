import { useState, useCallback, useMemo } from 'react';

interface PaginationState {
    pageIndex: number;
    pageSize: number;
}

interface SortState {
    sortBy: string | null;
    sortDirection: 'asc' | 'desc';
}

export const usePagination = (initialPageSize: number = 10) => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize,
    });

    const goToPage = useCallback((pageIndex: number) => {
        setPagination((prev) => ({ ...prev, pageIndex }));
    }, []);

    const setPageSize = useCallback((pageSize: number) => {
        setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 }));
    }, []);

    return { pagination, goToPage, setPageSize };
};

export const useSort = () => {
    const [sort, setSort] = useState<SortState>({
        sortBy: null,
        sortDirection: 'asc',
    });

    const onSort = useCallback((column: string) => {
        setSort((prev) => ({
            sortBy: column,
            sortDirection:
                prev.sortBy === column && prev.sortDirection === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    return { sort, onSort };
};

export const useDataGridState = (initialPageSize: number = 10) => {
    const { pagination, goToPage, setPageSize } = usePagination(initialPageSize);
    const { sort, onSort } = useSort();

    return { pagination, sort, goToPage, setPageSize, onSort };
};