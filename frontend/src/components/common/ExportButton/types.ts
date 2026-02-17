export interface ExportButtonProps {
    onExport: (format: ExportFormat) => void;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    label?: string;
}

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

export interface ExportOptions {
    format: ExportFormat;
    fileName?: string;
    includeHeaders?: boolean;
}