export interface LoadingSpinnerProps {
    isLoading: boolean;
    size?: 'small' | 'medium' | 'large';
    color?: string;
    message?: string;
    overlay?: boolean;
}

export type LoadingSpinnerSize = 'small' | 'medium' | 'large';

export interface LoadingSpinnerState {
    isVisible: boolean;
}