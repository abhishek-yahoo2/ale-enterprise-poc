export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export interface PaginationState {
    currentPage: number;
    pageSize: number;
    totalItems: number;
}

export interface PaginationOptions {
    pageSize?: number;
    maxVisiblePages?: number;
    showFirstLast?: boolean;
    showPreviousNext?: boolean;
}