export interface DataGridColumn {
    id: string;
    header: string;
    accessor: string;
    width?: number;
    sortable?: boolean;
    filterable?: boolean;
    render?: (value: unknown, row: DataGridRow) => React.ReactNode;
}

export interface DataGridRow {
    id: string | number;
    [key: string]: unknown;
}

export interface DataGridProps {
    columns: DataGridColumn[];
    rows: DataGridRow[];
    loading?: boolean;
    pagination?: DataGridPagination;
    sorting?: DataGridSorting;
    onPaginationChange?: (pagination: DataGridPagination) => void;
    onSortingChange?: (sorting: DataGridSorting) => void;
    onRowClick?: (row: DataGridRow) => void;
    selectable?: boolean;
    selectedRows?: (string | number)[];
    onSelectionChange?: (selectedRows: (string | number)[]) => void;
}

export interface DataGridPagination {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
}

export interface DataGridSorting {
    columnId: string;
    direction: 'asc' | 'desc';
}

export interface DataGridState {
    pagination: DataGridPagination;
    sorting: DataGridSorting | null;
    selectedRows: (string | number)[];
}