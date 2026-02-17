# ALE -- API Specification & Documentation

## 1. Purpose

This document defines **complete API specifications**, **endpoint documentation**, **request/response contracts**, and **integration patterns** for the ALE application.

The goal is to ensure:
- Clear API contracts between frontend and backend
- Consistent endpoint naming and structure
- Comprehensive error handling
- Type-safe API integration
- Complete OpenAPI/Swagger documentation

---

## 2. API Design Standards

### 2.1 Base Configuration

**Base URL**
```
Development:  http://localhost:8080/api
Staging:      https://staging-ale.northerntrust.com/api
Production:   https://ale.northerntrust.com/api
```

**API Versioning**
- Version included in path: `/api/v1/...`
- Current version: `v1`
- Breaking changes require new version

**Authentication**
- JWT Bearer token authentication
- SSO integration for user authentication
- Token expiration: 8 hours
- Refresh token: 30 days

**Headers**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
X-Correlation-ID: {uuid}
```

### 2.2 HTTP Methods & Status Codes

**HTTP Methods**
- `GET` - Retrieve resources (read-only)
- `POST` - Create resources or complex queries (search)
- `PUT` - Update entire resource
- `PATCH` - Partial update
- `DELETE` - Remove resource

**Success Status Codes**
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST (resource created)
- `204 No Content` - Successful DELETE

**Error Status Codes**
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Concurrent modification
- `423 Locked` - Resource locked by another user
- `500 Internal Server Error` - Server error

### 2.3 Standard Response Format

**Success Response**
```json
{
  "data": { /* resource or array */ },
  "status": 200,
  "message": "Success"
}
```

**Paginated Response**
```json
{
  "content": [
    { /* resource 1 */ },
    { /* resource 2 */ }
  ],
  "pagination": {
    "currentPage": 0,
    "pageSize": 25,
    "totalElements": 150,
    "totalPages": 6
  }
}
```

**Error Response**
```json
{
  "timestamp": "2026-02-10T10:30:00Z",
  "status": 400,
  "error": "Validation Failed",
  "errorCode": "VAL_003",
  "message": "Percentage total exceeds 100%",
  "path": "/api/capital-call/123",
  "correlationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

### 2.4 Naming Conventions

**Endpoints**
- Use kebab-case: `/document-tracker`, `/capital-call`
- Resources in plural: `/documents`, `/capital-calls`
- Actions as verbs: `/submit`, `/approve`, `/unlock`

**Query Parameters**
- Use camelCase: `?aleBatchId=123&fromDate=2026-01-01`

**JSON Fields**
- Use camelCase: `{ "aleBatchId": "ALE-123456" }`

---

## 3. Document Tracker API

### 3.1 Search Documents

**Endpoint**
```
POST /api/document-tracker/search
```

**Description**
Search and filter document tracker records with pagination and sorting.

**Request Body**
```json
{
  "filters": {
    "genId": "GEN12345678",
    "documentType": "TYPE1",
    "fromDate": "2026-01-01",
    "toDate": "2026-01-31"
  },
  "pagination": {
    "page": 0,
    "size": 25
  },
  "sort": [
    {
      "field": "receivedAt",
      "direction": "DESC"
    }
  ]
}
```

**Response - 200 OK**
```json
{
  "content": [
    {
      "id": 1,
      "genId": "GEN12345678",
      "documentType": "TYPE1",
      "receivedAt": "2026-02-01T10:30:00Z",
      "createdAt": "2026-02-01T10:30:00Z",
      "createdBy": "user@example.com"
    }
  ],
  "pagination": {
    "currentPage": 0,
    "pageSize": 25,
    "totalElements": 150,
    "totalPages": 6
  }
}
```

**Validation Rules**
- `page`: Min 0
- `size`: Min 1, Max 200, Default 25
- `genId`: Pattern `GEN\d{8}` (if provided)
- `sort.field`: Must be whitelisted field
- `sort.direction`: Must be `ASC` or `DESC`

**Error Responses**
- `400` - Invalid filter values or pagination parameters
- `401` - Unauthorized
- `403` - User lacks RULE_VIEW permission

**TypeScript Interface**
```typescript
interface DocumentSearchRequest {
  filters: {
    genId?: string;
    documentType?: string;
    fromDate?: string;
    toDate?: string;
  };
  pagination: {
    page: number;
    size: number;
  };
  sort: Array<{
    field: string;
    direction: 'ASC' | 'DESC';
  }>;
}

interface DocumentSearchResponse {
  content: DocumentTracker[];
  pagination: PaginationMetadata;
}

interface DocumentTracker {
  id: number;
  genId: string;
  documentType: string;
  receivedAt: string;
  createdAt: string;
  createdBy: string;
}
```

### 3.2 Get Document Details

**Endpoint**
```
GET /api/document-tracker/{genId}/details
```

**Description**
Retrieve detailed information about a document including all sub-documents.

**Path Parameters**
- `genId` (string, required) - Document Gen ID, pattern: `GEN\d{8}`

**Response - 200 OK**
```json
{
  "genId": "GEN12345678",
  "documentType": "TYPE1",
  "receivedAt": "2026-02-01T10:30:00Z",
  "subDocuments": [
    {
      "id": 1,
      "subId": "SUB001",
      "status": "PROCESS_COMPLETED",
      "severity": "SUCCESS",
      "statusMessage": "Processing completed successfully",
      "processedAt": "2026-02-01T11:00:00Z"
    },
    {
      "id": 2,
      "subId": "SUB002",
      "status": "PROCESS_FAILED",
      "severity": "ERROR",
      "statusMessage": "Validation failed at service XYZ",
      "processedAt": "2026-02-01T11:05:00Z"
    }
  ]
}
```

**Error Responses**
- `400` - Invalid genId format
- `404` - Document not found (DT-01)

**TypeScript Interface**
```typescript
interface DocumentDetails {
  genId: string;
  documentType: string;
  receivedAt: string;
  subDocuments: SubDocument[];
}

interface SubDocument {
  id: number;
  subId: string;
  status: 'PROCESS_FAILED' | 'PROCESS_COMPLETED' | 'IN_PROGRESS';
  severity: 'ERROR' | 'SUCCESS' | 'WARNING' | 'INFO';
  statusMessage: string;
  processedAt: string;
}
```

### 3.3 Export Documents

**Endpoint**
```
POST /api/document-tracker/export
```

**Description**
Export search results to Excel file.

**Request Body**
Same as search request.

**Response - 200 OK**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Binary Excel file

**Error Responses**
- `400` - Invalid request
- `403` - User lacks RULE_EXPORT permission

---

## 4. Capital Call API

### 4.1 Search Capital Calls

**Endpoint**
```
POST /api/capital-call/search
```

**Description**
Search capital call records with advanced filtering, pagination, and sorting.

**Request Body**
```json
{
  "filters": {
    "aleBatchId": "ALE-123456",
    "toeReference": "TOE-001",
    "fromDate": "2026-01-01",
    "toDate": "2026-01-31",
    "dayType": "BUSINESS",
    "clientName": "Client ABC",
    "workflowStatus": "SUBMITTED"
  },
  "pagination": {
    "page": 0,
    "size": 25
  },
  "sort": [
    {
      "field": "createdAt",
      "direction": "DESC"
    }
  ]
}
```

**Response - 200 OK**
```json
{
  "content": [
    {
      "id": 1,
      "aleBatchId": "ALE-123456",
      "fromDate": "2026-01-01",
      "toDate": "2026-01-31",
      "dayType": null,
      "totalAmount": 1000000.00,
      "workflowStatus": "SUBMITTED",
      "lockedBy": "user@example.com",
      "lockedAt": "2026-02-10T09:00:00Z",
      "clientName": "Client ABC",
      "assetDescription": "Private Equity Fund A",
      "isSensitive": true,
      "createdAt": "2026-02-09T10:00:00Z",
      "createdBy": "user@example.com"
    }
  ],
  "pagination": {
    "currentPage": 0,
    "pageSize": 25,
    "totalElements": 45,
    "totalPages": 2
  }
}
```

**Business Rules**
- If `fromDate` OR `toDate` present → `dayType` ignored
- If `aleBatchId` OR `toeReference` present → `dayType` ignored
- Backend must not fail if `dayType` missing

**Validation Rules**
- `aleBatchId`: Pattern `ALE-\d{6}` (CC-06)
- `fromDate` <= `toDate` (CC-05)
- `workflowStatus`: Enum values only

**TypeScript Interface**
```typescript
interface CapitalCallSearchRequest {
  filters: {
    aleBatchId?: string;
    toeReference?: string;
    fromDate?: string;
    toDate?: string;
    dayType?: string;
    clientName?: string;
    workflowStatus?: WorkflowStatus;
  };
  pagination: PaginationRequest;
  sort: SortRequest[];
}

interface CapitalCall {
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

enum WorkflowStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
```

### 4.2 Get Capital Call Details

**Endpoint**
```
GET /api/capital-call/{id}
```

**Description**
Retrieve complete capital call details including breakdowns and comments.

**Path Parameters**
- `id` (number, required) - Capital call ID

**Response - 200 OK**
```json
{
  "id": 1,
  "aleBatchId": "ALE-123456",
  "fromDate": "2026-01-01",
  "toDate": "2026-01-31",
  "totalAmount": 1000000.00,
  "workflowStatus": "DRAFT",
  "clientName": "Client ABC",
  "assetDescription": "Private Equity Fund A",
  "lockedBy": "user@example.com",
  "lockedAt": "2026-02-10T09:00:00Z",
  "breakdowns": [
    {
      "id": 1,
      "category": "MANAGEMENT_FEES",
      "percentage": 60.00,
      "calculatedAmount": 600000.00
    },
    {
      "id": 2,
      "category": "PERFORMANCE_FEES",
      "percentage": 40.00,
      "calculatedAmount": 400000.00
    }
  ],
  "comments": [
    {
      "id": 1,
      "text": "Updated breakdown percentages",
      "createdBy": "user@example.com",
      "createdAt": "2026-02-10T09:30:00Z"
    }
  ],
  "createdAt": "2026-02-09T10:00:00Z",
  "createdBy": "user@example.com",
  "modifiedAt": "2026-02-10T09:30:00Z",
  "modifiedBy": "user@example.com",
  "version": 2
}
```

**Error Responses**
- `404` - Capital call not found
- `423` - Capital call locked by another user (if accessing for edit)

**TypeScript Interface**
```typescript
interface CapitalCallDetails extends CapitalCall {
  breakdowns: Breakdown[];
  comments: Comment[];
  modifiedAt: string | null;
  modifiedBy: string | null;
  version: number;
}

interface Breakdown {
  id: number;
  category: BreakdownCategory;
  percentage: number;
  calculatedAmount: number;
}

enum BreakdownCategory {
  MANAGEMENT_FEES = 'MANAGEMENT_FEES',
  PERFORMANCE_FEES = 'PERFORMANCE_FEES',
  OPERATING_EXPENSES = 'OPERATING_EXPENSES',
  DISTRIBUTIONS = 'DISTRIBUTIONS',
  OTHER = 'OTHER'
}
```

### 4.3 Create Capital Call

**Endpoint**
```
POST /api/capital-call
```

**Description**
Create a new capital call in DRAFT status. Automatically acquires lock for the creator.

**Request Body**
```json
{
  "aleBatchId": "ALE-123456",
  "fromDate": "2026-01-01",
  "toDate": "2026-01-31",
  "totalAmount": 1000000.00,
  "breakdowns": [
    {
      "category": "MANAGEMENT_FEES",
      "percentage": 60.00
    },
    {
      "category": "PERFORMANCE_FEES",
      "percentage": 40.00
    }
  ]
}
```

**Response - 201 Created**
```json
{
  "id": 1,
  "aleBatchId": "ALE-123456",
  "fromDate": "2026-01-01",
  "toDate": "2026-01-31",
  "totalAmount": 1000000.00,
  "workflowStatus": "DRAFT",
  "lockedBy": "user@example.com",
  "lockedAt": "2026-02-10T10:00:00Z",
  "breakdowns": [
    {
      "id": 1,
      "category": "MANAGEMENT_FEES",
      "percentage": 60.00,
      "calculatedAmount": 600000.00
    },
    {
      "id": 2,
      "category": "PERFORMANCE_FEES",
      "percentage": 40.00,
      "calculatedAmount": 400000.00
    }
  ],
  "createdAt": "2026-02-10T10:00:00Z",
  "createdBy": "user@example.com"
}
```

**Validation Rules**
- `aleBatchId`: Required, pattern `ALE-\d{6}` (CC-06)
- `totalAmount`: Required, > 0 (CC-10)
- `breakdowns`: Required, at least 1 item
- `percentage` total: Must be ≤ 100 (CC-03)
- `fromDate` <= `toDate` if both provided (CC-05)
- Date range ≤ 1 year (CC-08)

**Error Responses**
- `400` - Validation failed (see error code)
- `403` - User lacks RULE_EDIT permission

**TypeScript Interface**
```typescript
interface CreateCapitalCallRequest {
  aleBatchId: string;
  fromDate?: string;
  toDate?: string;
  totalAmount: number;
  breakdowns: CreateBreakdownRequest[];
}

interface CreateBreakdownRequest {
  category: BreakdownCategory;
  percentage: number;
}
```

### 4.4 Update Capital Call

**Endpoint**
```
PUT /api/capital-call/{id}
```

**Description**
Update an existing capital call. Requires lock ownership.

**Path Parameters**
- `id` (number, required) - Capital call ID

**Request Body**
```json
{
  "aleBatchId": "ALE-123456",
  "fromDate": "2026-01-01",
  "toDate": "2026-01-31",
  "totalAmount": 1200000.00,
  "breakdowns": [
    {
      "id": 1,
      "category": "MANAGEMENT_FEES",
      "percentage": 50.00
    },
    {
      "id": 2,
      "category": "PERFORMANCE_FEES",
      "percentage": 50.00
    }
  ]
}
```

**Response - 200 OK**
Same as get details response with updated values.

**Business Rules**
- Must be locked by requesting user (CC-01)
- Cannot update if status is APPROVED
- Breakdown amounts recalculated automatically

**Error Responses**
- `400` - Validation failed
- `404` - Capital call not found
- `409` - Concurrent modification (version mismatch)
- `423` - Locked by another user (LOCK_001)

### 4.5 Submit Capital Call

**Endpoint**
```
POST /api/capital-call/{id}/submit
```

**Description**
Submit capital call for approval. Transitions status from DRAFT to SUBMITTED. Releases lock.

**Path Parameters**
- `id` (number, required) - Capital call ID

**Response - 200 OK**
```json
{
  "id": 1,
  "workflowStatus": "SUBMITTED",
  "lockedBy": null,
  "lockedAt": null,
  "modifiedAt": "2026-02-10T11:00:00Z",
  "modifiedBy": "user@example.com"
}
```

**Business Rules**
- Current status must be DRAFT (CC-07)
- All validation rules must pass (CC-03, CC-05, CC-08)
- Requires RULE_SUBMIT permission
- Audit event triggered (CC-04)
- Lock released after submission

**Error Responses**
- `400` - Invalid status transition (BUS_001)
- `400` - Validation failed
- `403` - User lacks RULE_SUBMIT permission
- `404` - Capital call not found

### 4.6 Approve Capital Call

**Endpoint**
```
POST /api/capital-call/{id}/approve
```

**Description**
Approve a submitted capital call. Transitions status from SUBMITTED to APPROVED.

**Path Parameters**
- `id` (number, required) - Capital call ID

**Response - 200 OK**
```json
{
  "id": 1,
  "workflowStatus": "APPROVED",
  "modifiedAt": "2026-02-10T12:00:00Z",
  "modifiedBy": "approver@example.com"
}
```

**Business Rules**
- Current status must be SUBMITTED (CC-07)
- Requires RULE_APPROVE permission
- Audit event triggered
- Approved records are immutable

**Error Responses**
- `400` - Invalid status transition (BUS_001)
- `403` - User lacks RULE_APPROVE permission
- `404` - Capital call not found

### 4.7 Unlock Capital Call

**Endpoint**
```
POST /api/capital-call/{id}/unlock
```

**Description**
Force unlock a capital call. Kicks out the current user holding the lock.

**Path Parameters**
- `id` (number, required) - Capital call ID

**Response - 204 No Content**

**Business Rules**
- Requires RULE_UNLOCK_WORK_ITEM permission (CC-02)
- Audit event triggered
- Current user with lock receives notification

**Error Responses**
- `403` - User lacks RULE_UNLOCK_WORK_ITEM permission
- `404` - Capital call not found or not locked

---

## 5. Alternative Data Management API

### 5.1 Search Alternative Data

**Endpoint**
```
POST /api/alternative-data/search
```

**Description**
Advanced search with column-level filtering.

**Request Body**
```json
{
  "filters": {
    "clientName": "Client ABC",
    "accountNumber": "ACC-001",
    "dataSource": "SOURCE1",
    "reportDate": "2026-02-01",
    "status": "VALIDATED"
  },
  "pagination": {
    "page": 0,
    "size": 25
  },
  "sort": [
    {
      "field": "reportDate",
      "direction": "DESC"
    }
  ]
}
```

**Response - 200 OK**
```json
{
  "content": [
    {
      "id": 1,
      "clientName": "Client ABC",
      "accountNumber": "ACC-001",
      "fundFamily": "Fund Family A",
      "assetDescription": "Asset Description 1",
      "dataSource": "SOURCE1",
      "reportDate": "2026-02-01",
      "status": "VALIDATED",
      "createdAt": "2026-02-01T10:00:00Z",
      "createdBy": "user@example.com"
    }
  ],
  "pagination": {
    "currentPage": 0,
    "pageSize": 25,
    "totalElements": 200,
    "totalPages": 8
  }
}
```

**TypeScript Interface**
```typescript
interface AlternativeDataRecord {
  id: number;
  clientName: string;
  accountNumber: string;
  fundFamily: string;
  assetDescription: string;
  dataSource: string;
  reportDate: string;
  status: DataStatus;
  createdAt: string;
  createdBy: string;
  modifiedAt?: string;
  modifiedBy?: string;
}

enum DataStatus {
  DRAFT = 'DRAFT',
  VALIDATED = 'VALIDATED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}
```

### 5.2 Get Column Preferences

**Endpoint**
```
GET /api/alternative-data/column-preferences
```

**Description**
Retrieve user's column preferences for the module.

**Query Parameters**
- `moduleName` (string, required) - Module name (ALTERNATIVE_DATA)

**Response - 200 OK**
```json
{
  "id": 1,
  "userId": "user@example.com",
  "moduleName": "ALTERNATIVE_DATA",
  "viewName": "My Custom View",
  "columns": [
    "id",
    "clientName",
    "accountNumber",
    "reportDate",
    "status"
  ],
  "displayOrder": [
    "clientName",
    "accountNumber",
    "reportDate",
    "status",
    "id"
  ],
  "isDefault": true,
  "updatedAt": "2026-02-10T10:00:00Z"
}
```

**TypeScript Interface**
```typescript
interface ColumnPreference {
  id: number;
  userId: string;
  moduleName: string;
  viewName: string;
  columns: string[];
  displayOrder: string[];
  isDefault: boolean;
  updatedAt: string;
}
```

### 5.3 Save Column Preferences

**Endpoint**
```
POST /api/alternative-data/column-preferences
```

**Description**
Save or update user's column preferences.

**Request Body**
```json
{
  "moduleName": "ALTERNATIVE_DATA",
  "viewName": "My Custom View",
  "columns": [
    "id",
    "clientName",
    "accountNumber",
    "reportDate",
    "status"
  ],
  "displayOrder": [
    "clientName",
    "accountNumber",
    "reportDate",
    "status",
    "id"
  ],
  "isDefault": true
}
```

**Response - 201 Created / 200 OK**
Same as get response.

**Validation Rules**
- Max 40 columns (AD-01)
- Columns must be from whitelist (AD-02)
- Requires RULE_EDIT permission (AD-03)

**Error Responses**
- `400` - Max columns exceeded (VAL_009)
- `400` - Invalid column names (VAL_010)
- `403` - User lacks RULE_EDIT permission

### 5.4 Get Audit Trail

**Endpoint**
```
GET /api/alternative-data/{id}/audit-trail
```

**Description**
Retrieve change history for a specific record.

**Path Parameters**
- `id` (number, required) - Record ID

**Query Parameters**
- `fieldName` (string, optional) - Filter by specific field

**Response - 200 OK**
```json
{
  "auditTrail": [
    {
      "id": 1,
      "entityType": "AlternativeDataRecord",
      "entityId": "123",
      "fieldName": "status",
      "oldValue": "DRAFT",
      "newValue": "VALIDATED",
      "changedBy": "user@example.com",
      "timestamp": "2026-02-10T10:00:00Z",
      "correlationId": "a1b2c3d4-e5f6-7890"
    },
    {
      "id": 2,
      "entityType": "AlternativeDataRecord",
      "entityId": "123",
      "fieldName": "clientName",
      "oldValue": "Old Client Name",
      "newValue": "New Client Name",
      "changedBy": "user@example.com",
      "timestamp": "2026-02-09T14:00:00Z",
      "correlationId": "b2c3d4e5-f6g7-8901"
    }
  ]
}
```

**TypeScript Interface**
```typescript
interface AuditEntry {
  id: number;
  entityType: string;
  entityId: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  changedBy: string;
  timestamp: string;
  correlationId: string;
}
```

---

## 6. Locking API

### 6.1 Acquire Lock

**Endpoint**
```
POST /api/locks/acquire
```

**Description**
Acquire lock on an entity before editing.

**Request Body**
```json
{
  "entityType": "CapitalCall",
  "entityId": "123",
  "username": "user@example.com"
}
```

**Response - 200 OK**
```json
{
  "id": 1,
  "entityType": "CapitalCall",
  "entityId": "123",
  "lockedBy": "user@example.com",
  "lockedAt": "2026-02-10T10:00:00Z",
  "expiresAt": "2026-02-10T10:30:00Z"
}
```

**Business Rules**
- First access creates lock (CC-01)
- Lock timeout: 30 minutes (configurable) (CC-11)
- If already locked by same user, extends timeout
- Max 5 concurrent locks per user (CC-12)

**Error Responses**
- `423` - Entity locked by another user (LOCK_423)
- `400` - User has max concurrent locks (LOCK_002)

### 6.2 Release Lock

**Endpoint**
```
POST /api/locks/release
```

**Description**
Release lock on an entity.

**Request Body**
```json
{
  "entityType": "CapitalCall",
  "entityId": "123",
  "username": "user@example.com"
}
```

**Response - 204 No Content**

**Error Responses**
- `403` - Cannot release lock owned by another user
- `404` - Lock not found

### 6.3 Force Unlock

**Endpoint**
```
POST /api/locks/force-unlock
```

**Description**
Force unlock entity. Requires special permission.

**Request Body**
```json
{
  "entityType": "CapitalCall",
  "entityId": "123"
}
```

**Response - 204 No Content**

**Business Rules**
- Requires RULE_UNLOCK_WORK_ITEM permission (CC-02)
- Kicks out current user
- Audit event triggered

**Error Responses**
- `403` - User lacks RULE_UNLOCK_WORK_ITEM permission
- `404` - Lock not found

---

## 7. Common Query Parameters

### 7.1 Pagination

```
?page=0&size=25
```

- `page`: Page number (0-indexed), default 0
- `size`: Page size, default 25, max 200

### 7.2 Sorting

```
?sort=fieldName,direction
```

- Multiple sort parameters allowed
- Example: `?sort=createdAt,DESC&sort=clientName,ASC`

### 7.3 Filtering (GET requests)

```
?status=SUBMITTED&fromDate=2026-01-01&toDate=2026-01-31
```

---

## 8. Error Codes Reference

### Document Tracker
| Code      | Message                                | HTTP Status |
|-----------|----------------------------------------|-------------|
| ENT_404   | Document with GenId {id} not found     | 404         |
| VAL_001   | SubId does not belong to GenId         | 400         |
| VAL_002   | Status cannot change from COMPLETED    | 400         |
| VAL_003   | Invalid GenId format                   | 400         |

### Capital Call
| Code      | Message                                | HTTP Status |
|-----------|----------------------------------------|-------------|
| LOCK_001  | Must acquire lock before editing       | 423         |
| LOCK_002  | Maximum concurrent locks exceeded      | 400         |
| LOCK_423  | Resource locked by {username}          | 423         |
| VAL_003   | Percentage total exceeds 100%          | 400         |
| VAL_004   | From date must be before To date       | 400         |
| VAL_005   | Invalid batch ID format                | 400         |
| VAL_006   | Date range cannot exceed 1 year        | 400         |
| VAL_008   | Total amount must be greater than 0    | 400         |
| BUS_001   | Invalid status transition              | 400         |
| AUTH_002  | User not authorized for this operation | 403         |

### Alternative Data
| Code      | Message                                | HTTP Status |
|-----------|----------------------------------------|-------------|
| VAL_009   | Maximum 40 columns allowed             | 400         |
| VAL_010   | Invalid column names provided          | 400         |

---

## 9. OpenAPI/Swagger Documentation

### 9.1 Access Swagger UI

```
http://localhost:8080/swagger-ui.html
```

### 9.2 OpenAPI JSON

```
http://localhost:8080/v3/api-docs
```

### 9.3 Example Annotation

```java
@Operation(
    summary = "Submit capital call for approval",
    description = "Validates and transitions capital call from DRAFT to SUBMITTED status. " +
                 "Requires RULE_SUBMIT permission. Releases lock upon successful submission."
)
@ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "Capital call submitted successfully",
        content = @Content(schema = @Schema(implementation = CapitalCallResponse.class))
    ),
    @ApiResponse(
        responseCode = "400",
        description = "Validation failed or invalid status transition",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class))
    ),
    @ApiResponse(
        responseCode = "403",
        description = "User not authorized to submit",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class))
    ),
    @ApiResponse(
        responseCode = "404",
        description = "Capital call not found",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class))
    )
})
@PostMapping("/{id}/submit")
public ResponseEntity<CapitalCallResponse> submit(
    @Parameter(description = "Capital call ID", required = true)
    @PathVariable Long id,
    @Parameter(hidden = true) @AuthenticationPrincipal User user
) {
    return ResponseEntity.ok(service.submit(id, user));
}
```

---

## 10. API Integration Examples

### 10.1 TypeScript/Axios

```typescript
// api/capitalCallApi.ts
import { apiClient } from '@/lib/api/client';

export const capitalCallApi = {
  search: async (request: SearchRequest): Promise<PaginatedResponse<CapitalCall>> => {
    const { data } = await apiClient.post('/api/capital-call/search', request);
    return data;
  },

  getDetails: async (id: number): Promise<CapitalCallDetails> => {
    const { data } = await apiClient.get(`/api/capital-call/${id}`);
    return data;
  },

  create: async (request: CreateCapitalCallRequest): Promise<CapitalCall> => {
    const { data } = await apiClient.post('/api/capital-call', request);
    return data;
  },

  update: async (id: number, request: UpdateCapitalCallRequest): Promise<CapitalCall> => {
    const { data } = await apiClient.put(`/api/capital-call/${id}`, request);
    return data;
  },

  submit: async (id: number): Promise<CapitalCall> => {
    const { data } = await apiClient.post(`/api/capital-call/${id}/submit`);
    return data;
  },

  approve: async (id: number): Promise<CapitalCall> => {
    const { data } = await apiClient.post(`/api/capital-call/${id}/approve`);
    return data;
  },

  unlock: async (id: number): Promise<void> => {
    await apiClient.post(`/api/capital-call/${id}/unlock`);
  }
};
```

### 10.2 React Query Integration

```typescript
export const useCapitalCallDetails = (id: number) => {
  return useQuery({
    queryKey: ['capital-call', id],
    queryFn: () => capitalCallApi.getDetails(id),
    enabled: !!id
  });
};

export const useSubmitCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => capitalCallApi.submit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      toast.success('Capital call submitted successfully');
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.message);
    }
  });
};
```

---

## 11. Testing & Validation

### 11.1 Postman Collection

Create Postman collection with:
- All endpoints documented
- Example requests/responses
- Environment variables for different environments
- Pre-request scripts for authentication

### 11.2 API Contract Testing

```typescript
describe('Capital Call API', () => {
  it('should return 400 when percentage exceeds 100', async () => {
    const request = {
      aleBatchId: 'ALE-123456',
      totalAmount: 1000000,
      breakdowns: [
        { category: 'MANAGEMENT_FEES', percentage: 60 },
        { category: 'PERFORMANCE_FEES', percentage: 50 }
      ]
    };

    const response = await api.post('/api/capital-call', request);

    expect(response.status).toBe(400);
    expect(response.data.errorCode).toBe('VAL_003');
    expect(response.data.message).toContain('exceeds 100');
  });
});
```

---

## 12. Best Practices

### ✅ DO
- Always include `X-Correlation-ID` in headers
- Use POST for search operations (complex filtering)
- Return proper HTTP status codes
- Include pagination for list endpoints
- Validate all inputs
- Use consistent error response format
- Document all endpoints with OpenAPI annotations
- Version your APIs
- Use DTOs, never expose entities

### ❌ DON'T
- Return 200 with error in body
- Use GET for operations that modify state
- Expose internal errors to clients
- Skip validation
- Return stack traces
- Use inconsistent naming
- Forget correlation IDs
- Skip API documentation

---

**This API specification ensures consistent, well-documented endpoints for seamless frontend-backend integration.**