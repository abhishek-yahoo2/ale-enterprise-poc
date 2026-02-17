/**
 * COPILOT: Capital Call type definitions matching UI mockups
 * 
 * Based on grid columns visible in screenshots:
 * - SLA, Notice Pay Date, Wire Pay Date, Instruction Type
 * - Client Name, Asset Description, Account Id, Asset Id
 * - Account Type, Currency, Amount, NT Tech
 * - TOE Reference, ALE Batch Id, Status
 * 
 * Row background colors indicate:
 * - Red = isSensitive: true
 * - Yellow = hasAlert: true
 * - White = normal
 */

// Main tabs from navigation bar
export enum CapitalCallTab {
  FOR_REVIEW = 'FOR_REVIEW',
  REJECTED_BY_APPROVER = 'REJECTED_BY_APPROVER',
  EXCEPTION = 'EXCEPTION',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  FOLLOW_UP_REQUIRED = 'FOLLOW_UP_REQUIRED'
}

// Sub-tabs under "FOR REVIEW" with count cards
export enum ForReviewSubTab {
  SSI_VERIFICATION_NEEDED = 'SSI_VERIFICATION_NEEDED',
  TRANSACTION_TO_BE_PROCESSED = 'TRANSACTION_TO_BE_PROCESSED',
  MISSING_FUND_DOCUMENT = 'MISSING_FUND_DOCUMENT',
  MISSING_CLIENT_INSTRUCTION = 'MISSING_CLIENT_INSTRUCTION',
  MISSING_CLIENT_AND_FUND_INSTRUCTION = 'MISSING_CLIENT_AND_FUND_INSTRUCTION'
}

// Workflow status
export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// Main Capital Call entity matching grid columns
export interface CapitalCall {
  id: number;
  
  // Grid columns from left to right
  sla: string; // e.g., "NO"
  noticePayDate: string; // ISO date: "9/7/2025"
  wirePayDate: string | null;
  instructionType: string;
  clientName: string; // e.g., "XYZ UNIV"
  assetDescription: string; // e.g., "SG: INDIA GAMMY"
  accountId: string; // e.g., "123456"
  assetId: string; // e.g., "000123456"
  accountType: string; // e.g., "DV"
  currency: string; // e.g., "USD"
  amount: number; // e.g., 200.00
  ntTech: string; // e.g., "XYZ12"
  toeReference: string;
  aleBatchId: string; // e.g., "CASABC-123-240"
  status: string;
  
  // Additional fields not visible in grid but in filters
  due: string | null;
  fromDate: string | null;
  toDate: string | null;
  dayType: string | null;
  techRegion: string | null;
  queue: string | null;
  signOff: string | null;
  
  // Workflow and locking
  workflowStatus: WorkflowStatus;
  lockedBy: string | null; // e.g., "AK915"
  lockedAt: string | null;
  
  // Visual indicators
  isSensitive: boolean; // Red row
  hasAlert: boolean; // Yellow row
  
  // Audit
  createdAt: string;
  createdBy: string;
  modifiedAt: string | null;
  modifiedBy: string | null;
  version: number;
}

// Search filters matching the 3-row filter panel
export interface CapitalCallSearchFilters {
  // Row 1
  clientName?: string;
  accountId?: string;
  assetId?: string;
  accountType?: string;
  due?: string;
  instructionType?: string;
  sla?: string;
  
  // Row 2
  assetDescription?: string;
  amount?: number;
  currency?: string;
  fromDate?: string; // Will hide dayType when present
  toDate?: string; // Will hide dayType when present
  dayType?: string; // Hidden when fromDate OR toDate OR aleBatchId present
  techRegion?: string;
  
  // Row 3
  status?: string;
  queue?: string;
  toeReference?: string;
  aleBatchId?: string; // Will hide dayType when present
  signOff?: string;
  ntTech?: string;
}

// Sub-tab count card data
export interface SubTabCount {
  subTab: ForReviewSubTab;
  label: string;
  count: number;
  color: 'teal' | 'green'; // Teal for first, green for others
}

// Lock information for dialog
export interface LockInfo {
  isLocked: boolean;
  lockedBy: string | null;
  lockedAt: string | null;
  canForceUnlock: boolean; // Based on RULE_UNLOCK_WORK_ITEM permission
}