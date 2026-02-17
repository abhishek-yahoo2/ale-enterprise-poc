export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface ErrorInfo {
    componentStack: string;
    message: string;
}

export type ErrorHandler = (error: Error, errorInfo: React.ErrorInfo) => void;