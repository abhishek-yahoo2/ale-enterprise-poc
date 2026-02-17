// Common Types
export interface SearchRequest {
  filters: Record<string, any>;
  pagination: {
    page: number;
    size: number;
  };
  sort?: Array<{
    field: string;
    direction: 'ASC' | 'DESC';
  }>;
}

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface SearchResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

// Document Tracker Types
export interface DocumentTracker {
  id: number;
  genId: string;
  documentType: string;
  receivedAt: string;
  createdAt: string;
  createdBy: string;
}

export interface DocumentDetails {
  genId: string;
  documentType: string;
  receivedAt: string;
  subDocuments: SubDocument[];
}

export interface SubDocument {
  id: number;
  subId: string;
  status: SubIdStatus;
  statusMessage: string;
  processedAt: string;
  severity: Severity;
}

export enum SubIdStatus {
  PROCESS_FAILED = 'PROCESS_FAILED',
  PROCESS_COMPLETED = 'PROCESS_COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export enum Severity {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

// Capital Call Types
export interface CapitalCall {
  id: number;
  aleBatchId: string;
  fromDate: string | null;
  toDate: string | null;
  dayType: string | null;
  totalAmount: number;
  workflowStatus: WorkflowStatus;
  lockedBy: string | null;
  lockedAt: string | null;
  clientName: string;
  assetDescription: string;
  isSensitive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface CapitalCallDetails extends CapitalCall {
  breakdowns: Breakdown[];
  comments: Comment[];
  auditTrail: AuditEntry[];
}

export interface Breakdown {
  id: number;
  category: BreakdownCategory;
  percentage: number;
  calculatedAmount: number;
}

export enum BreakdownCategory {
  MANAGEMENT_FEES = 'MANAGEMENT_FEES',
  PERFORMANCE_FEES = 'PERFORMANCE_FEES',
  OPERATING_EXPENSES = 'OPERATING_EXPENSES',
  DISTRIBUTIONS = 'DISTRIBUTIONS',
  OTHER = 'OTHER'
}

export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Comment {
  id: number;
  text: string;
  createdBy: string;
  createdAt: string;
}

export interface AuditEntry {
  id: number;
  entityType: string;
  entityId: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  timestamp: string;
}

// Alternative Data Types
export interface AlternativeDataRecord {
  id: number;
  clientName: string;
  accountNumber: string;
  fundFamily: string;
  assetDescription: string;
  dataSource: string;
  reportDate: string;
  status: DataStatus;
  [key: string]: any; // Support for dynamic columns
}

export enum DataStatus {
  DRAFT = 'DRAFT',
  VALIDATED = 'VALIDATED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface ColumnPreference {
  id: number;
  userId: string;
  moduleName: string;
  viewName: string;
  columns: string[];
  displayOrder: string[];
  isDefault: boolean;
}

export interface UserColumnPreference {
  id: number;
  userId: string;
  moduleName: string;
  viewName: string;
  columns: string[];
}

export const AVAILABLE_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'clientName', label: 'Client Name' },
  { key: 'accountNumber', label: 'Account Number' },
  { key: 'fundFamily', label: 'Fund Family' },
  { key: 'assetDescription', label: 'Asset Description' },
  { key: 'dataSource', label: 'Data Source' },
  { key: 'reportDate', label: 'Report Date' },
  { key: 'status', label: 'Status' },
];

// Auth Types
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  permissions: string[];
  roles: string[];
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Request Types for forms
export interface CreateCapitalCallRequest {
  aleBatchId: string;
  fromDate?: string;
  toDate?: string;
  dayType?: string;
  totalAmount: number;
  breakdowns: CreateBreakdownRequest[];
}

export interface CreateBreakdownRequest {
  category: BreakdownCategory;
  percentage: number;
}

export interface UpdateCapitalCallRequest {
  aleBatchId: string;
  fromDate?: string;
  toDate?: string;
  dayType?: string;
  totalAmount: number;
  breakdowns: UpdateBreakdownRequest[];
}

export interface UpdateBreakdownRequest {
  id?: number;
  category: BreakdownCategory;
  percentage: number;
}

export interface SaveColumnPreferenceRequest {
  viewName: string;
  columns: string[];
  moduleName: string;
}
