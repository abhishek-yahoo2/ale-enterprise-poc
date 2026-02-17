import { useState, useCallback } from 'react';

interface EmptyStateConfig {
    title: string;
    description?: string;
    icon?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const useEmptyState = (initialConfig: EmptyStateConfig) => {
    const [config, setConfig] = useState<EmptyStateConfig>(initialConfig);
    const [isVisible, setIsVisible] = useState(true);

    const updateConfig = useCallback((newConfig: Partial<EmptyStateConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    const hide = useCallback(() => {
        setIsVisible(false);
    }, []);

    const show = useCallback(() => {
        setIsVisible(true);
    }, []);

    const reset = useCallback(() => {
        setConfig(initialConfig);
        setIsVisible(true);
    }, [initialConfig]);

    return {
        config,
        isVisible,
        updateConfig,
        hide,
        show,
        reset,
    };
};