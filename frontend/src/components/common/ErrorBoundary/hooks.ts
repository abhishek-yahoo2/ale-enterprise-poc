import { useState, useCallback, ReactNode } from 'react';

export interface ErrorState {
    error: Error | null;
    hasError: boolean;
}

export const useErrorHandler = () => {
    const [errorState, setErrorState] = useState<ErrorState>({
        error: null,
        hasError: false,
    });

    const setError = useCallback((error: Error | null) => {
        setErrorState({
            error,
            hasError: !!error,
        });
    }, []);

    const clearError = useCallback(() => {
        setErrorState({
            error: null,
            hasError: false,
        });
    }, []);

    return {
        ...errorState,
        setError,
        clearError,
    };
};

export const useAsyncError = () => {
    const { setError } = useErrorHandler();

    return useCallback((error: Error) => {
        setError(error);
    }, [setError]);
};

export const useSafeAsync = (callback: () => Promise<void>) => {
    const [loading, setLoading] = useState(false);
    const { setError } = useErrorHandler();

    const execute = useCallback(async () => {
        setLoading(true);
        try {
            await callback();
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    }, [callback, setError]);

    return { execute, loading };
};