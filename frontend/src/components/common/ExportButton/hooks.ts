import { useState, useCallback } from 'react';

export const useExportData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const exportData = useCallback(
        async (data: unknown, filename: string, format: 'json' | 'csv') => {
            setIsLoading(true);
            setError(null);

            try {
                let content = '';
                let mimeType = '';

                if (format === 'json') {
                    content = JSON.stringify(data, null, 2);
                    mimeType = 'application/json';
                } else if (format === 'csv') {
                    // CSV conversion logic
                    content = convertToCSV(data);
                    mimeType = 'text/csv';
                }

                const blob = new Blob([content], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${filename}.${format}`;
                link.click();
                URL.revokeObjectURL(url);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Export failed');
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return { exportData, isLoading, error };
};

const convertToCSV = (data: unknown): string => {
    if (Array.isArray(data) && data.length > 0) {
        const headers = Object.keys(data[0] as object);
        const rows = (data as Record<string, unknown>[]).map((obj) =>
            headers.map((h) => JSON.stringify(obj[h] ?? ''))
        );
        return [headers, ...rows].map((r) => r.join(',')).join('\n');
    }
    return '';
};