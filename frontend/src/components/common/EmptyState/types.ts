export interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    actionButton?: EmptyStateAction;
    className?: string;
}

export interface EmptyStateAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}