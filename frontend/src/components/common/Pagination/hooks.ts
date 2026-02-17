import { useState, useCallback } from 'react';

interface UsePaginationProps {
    initialPage?: number;
    pageSize?: number;
    totalItems?: number;
}

interface UsePaginationReturn {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    setPageSize: (size: number) => void;
}

export const usePagination = ({
    initialPage = 1,
    pageSize = 10,
    totalItems = 0,
}: UsePaginationProps = {}): UsePaginationReturn => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);

    const totalPages = Math.ceil(totalItems / currentPageSize) || 1;

    const goToPage = useCallback((page: number) => {
        const pageNum = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNum);
    }, [totalPages]);

    const nextPage = useCallback(() => {
        goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const prevPage = useCallback(() => {
        goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    const handleSetPageSize = useCallback((size: number) => {
        setCurrentPageSize(Math.max(1, size));
        setCurrentPage(1);
    }, []);

    return {
        currentPage,
        pageSize: currentPageSize,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        setPageSize: handleSetPageSize,
    };
};