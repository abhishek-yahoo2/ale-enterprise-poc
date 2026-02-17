import React from 'react';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
const XLSX = require('xlsx');

interface ExportButtonProps {
    data: Record<string, any>[];
    filename?: string;
    format?: 'csv' | 'xlsx';
}

export const ExportButton: React.FC<ExportButtonProps> = ({
    data,
    filename = 'export',
    format = 'csv',
}) => {
    const handleExport = () => {
        if (format === 'csv') {
            exportToCSV(data, filename);
        } else {
            exportToExcel(data, filename);
        }
    };

    return (
        <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
        >
            Export
        </Button>
    );
};

const exportToCSV = (data: Record<string, any>[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
        headers.join(','),
        ...data.map((row) =>
            headers
                .map((header) => {
                    const value = row[header];
                    return typeof value === 'string' && value.includes(',')
                        ? `"${value}"`
                        : value;
                })
                .join(',')
        ),
    ].join('\n');

    downloadFile(csv, `${filename}.csv`, 'text/csv');
};

const exportToExcel = (data: Record<string, any>[], filename: string) => {
    // Requires 'xlsx' package: npm install xlsx
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
};