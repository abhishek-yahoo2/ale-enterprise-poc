/* -------------------------------------------------- */
/* 📊 Alternative Data Record */
/* -------------------------------------------------- */

export interface AlternativeDataRecord {
  id: string;
  client: string;
  account: string;
  fundFamily: string;
  assetDescription: string;
  category?: string;

  status: 'Active' | 'Inactive' | 'Pending';

  effectiveDate: string;

  amount: number;
  currency: string;

  createdBy: string;
  createdDate: string;

  modifiedBy: string;
  modifiedDate: string;
}

/* -------------------------------------------------- */
/* 🔎 Search Request */
/* -------------------------------------------------- */

export interface SearchFilters {
  clientName?: string;
  status?: 'Active' | 'Inactive' | 'Pending';
  search?: string; // global search
  fromEffectiveDate?: string;
  toEffectiveDate?: string;

  // column-level search support
  columnFilters?: Record<string, string>;
}

export interface SortRequest {
  field: keyof AlternativeDataRecord;
  direction: 'ASC' | 'DESC';
}

export interface PaginationRequest {
  page: Number;
  size: Number;
}

export interface SearchRequest {
  filters?: SearchFilters;
  pagination?: PaginationRequest;   
  sort?: SortRequest;
}

/* -------------------------------------------------- */
/* 📄 Search Response */
/* -------------------------------------------------- */

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

/* -------------------------------------------------- */
/* 👤 Column Preferences */
/* -------------------------------------------------- */

export interface UserColumnPreference {
  columns: (keyof AlternativeDataRecord)[];
  viewName?: string;
}

/* -------------------------------------------------- */
/* 💾 Save Column Preference */
/* -------------------------------------------------- */

export interface SaveColumnPreferenceRequest {
  columns: (keyof AlternativeDataRecord)[];
  viewName?: string;
}
