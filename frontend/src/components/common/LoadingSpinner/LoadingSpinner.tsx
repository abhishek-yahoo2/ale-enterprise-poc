import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    /**
     * Whether the spinner should take up the full page
     * @default false
     */
    fullPage?: boolean;
    /**
     * Optional message to display below the spinner
     */
    message?: string;
    /**
     * Size of the spinner in pixels
     * @default 40
     */
    size?: number;
}

/**
 * LoadingSpinner component for displaying loading states
 * Can be used as a full-page overlay or inline spinner
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    fullPage = false,
    message = 'Loading...',
    size = 40,
}) => {
    const spinnerContent = (
        <div className="spinner-content">
            <div
                className="spinner"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                }}
            />
            {message && <p className="spinner-message">{message}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="loading-spinner-overlay">
                {spinnerContent}
            </div>
        );
    }

    return <div className="loading-spinner-inline">{spinnerContent}</div>;
};

export default LoadingSpinner;