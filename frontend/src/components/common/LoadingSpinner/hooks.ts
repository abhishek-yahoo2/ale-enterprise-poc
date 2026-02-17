import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to manage loading state
 */
export const useLoading = (initialState: boolean = false) => {
    const [isLoading, setIsLoading] = useState(initialState);

    const startLoading = useCallback(() => setIsLoading(true), []);
    const stopLoading = useCallback(() => setIsLoading(false), []);
    const toggleLoading = useCallback(() => setIsLoading(prev => !prev), []);

    return {
        isLoading,
        startLoading,
        stopLoading,
        toggleLoading,
        setIsLoading,
    };
};

/**
 * Hook to manage loading state with timeout
 */
export const useLoadingWithTimeout = (initialState: boolean = false, timeout: number = 3000) => {
    const [isLoading, setIsLoading] = useState(initialState);

    const startLoading = useCallback(() => {
        setIsLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    const startLoadingWithTimeout = useCallback(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), timeout);
        return () => clearTimeout(timer);
    }, [timeout]);

    return {
        isLoading,
        startLoading,
        stopLoading,
        startLoadingWithTimeout,
        setIsLoading,
    };
};

/**
 * Hook to manage async operation loading state
 */
export const useAsyncLoading = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(async <T,>(asyncFunction: () => Promise<T>): Promise<T | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await asyncFunction();
            return result;
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        execute,
    };
};