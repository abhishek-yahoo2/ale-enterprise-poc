//Generate code for Pagination logic in React using a custom hook. The usePagination hook should take in the total number of items, items per page, and the current page as parameters. It should return the total number of pages, a function to change the current page, and an array of page numbers to display for pagination controls.
import { useState, useMemo } from 'react';
interface UsePaginationProps {
    totalItems: number;
    itemsPerPage: number;
    initialPage?: number;
}
interface UsePaginationReturn {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (pageNumber: number) => void;
    pageNumbers: number[];
}
function usePagination({
    totalItems,
    itemsPerPage,
    initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / itemsPerPage);
    }, [totalItems, itemsPerPage]);
    const pageNumbers = useMemo(() => {
        const pages: number[] = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }, [totalPages]);
    const changePage = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    return {
        totalPages,
        currentPage,
        setCurrentPage: changePage,
        pageNumbers,
    };
}   
export default usePagination;