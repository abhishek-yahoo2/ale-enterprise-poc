import { z } from 'zod';

export const documentTrackerFilterSchema = z.object({
  genId: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^GEN\d+$/.test(value),
      'Gen ID must be in format GEN followed by numbers'
    ),
  documentType: z.string().optional(),
  fromDate: z
    .string()
    .optional()
    .refine(
      (value) => !value || !isNaN(Date.parse(value)),
      'Invalid date format'
    ),
  toDate: z
    .string()
    .optional()
    .refine(
      (value) => !value || !isNaN(Date.parse(value)),
      'Invalid date format'
    ),
}).refine(
  (data) => {
    if (data.fromDate && data.toDate) {
      return new Date(data.fromDate) <= new Date(data.toDate);
    }
    return true;
  },
  {
    message: 'From Date must be before or equal to To Date',
    path: ['toDate'],
  }
);

export type DocumentTrackerFiltersType = z.infer<typeof documentTrackerFilterSchema>;

// Advanced search schema
export const advancedSearchSchema = z.object({
  genId: z.string().optional(),
  documentType: z.string().optional(),
  createdBy: z.string().optional(),
  status: z.enum(['PROCESS_FAILED', 'PROCESS_COMPLETED', 'IN_PROGRESS', '']).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  severity: z.enum(['ERROR', 'SUCCESS', 'WARNING', 'INFO', '']).optional(),
}).refine(
  (data) => {
    if (data.fromDate && data.toDate) {
      return new Date(data.fromDate) <= new Date(data.toDate);
    }
    return true;
  },
  {
    message: 'From Date must be before or equal to To Date',
    path: ['toDate'],
  }
);

export type AdvancedSearchFilters = z.infer<typeof advancedSearchSchema>;
