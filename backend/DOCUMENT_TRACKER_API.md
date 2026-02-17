# Document Tracker Backend - CRUD API Documentation

## Overview

Complete CRUD (Create, Read, Update, Delete) operations for Document Tracker module with 50 pre-loaded test records for development and testing.

## API Endpoints

### 1. Search Documents (READ)
```
POST /api/document-tracker/search
```

**Request Body:**
```json
{
  "filters": {
    "genId": "GEN00000001",
    "documentType": "INVOICE",
    "createdBy": "TEST_USER"
  },
  "pagination": {
    "page": 0,
    "size": 20
  },
  "sort": [
    {
      "field": "receivedAt",
      "direction": "DESC"
    }
  ]
}
```

**Response:**
```json
{
  "data": [
    {
      "genId": "GEN00000001",
      "documentType": "INVOICE",
      "receivedAt": "2026-01-15T10:30:00",
      "createdAt": "2026-01-15T10:30:00",
      "createdBy": "TEST_USER",
      "modifiedAt": "2026-02-12T15:45:00",
      "modifiedBy": "TEST_USER"
    }
  ],
  "pagination": {
    "currentPage": 0,
    "pageSize": 20,
    "totalElements": 50,
    "totalPages": 3
  }
}
```

**Status Code:** 200 OK

---

### 2. Get Document Details (READ)
```
GET /api/document-tracker/{genId}/details
```

**Path Parameters:**
- `genId` - Document Gen ID (e.g., GEN00000001)

**Response:**
```json
{
  "genId": "GEN00000001",
  "documentType": "INVOICE",
  "receivedAt": "2026-01-15T10:30:00",
  "subDocuments": [
    {
      "subId": "GEN00000001_SUB_1",
      "status": "PROCESS_COMPLETED",
      "severity": "SUCCESS",
      "statusMessage": "Processing completed successfully",
      "processedAt": "2026-01-15T11:00:00",
      "createdAt": "2026-01-15T11:00:00",
      "createdBy": "TEST_USER",
      "modifiedAt": "2026-02-12T15:45:00",
      "modifiedBy": "TEST_USER"
    }
  ],
  "createdAt": "2026-01-15T10:30:00",
  "createdBy": "TEST_USER",
  "modifiedAt": "2026-02-12T15:45:00",
  "modifiedBy": "TEST_USER"
}
```

**Status Code:** 200 OK

**Error Response (404):**
```json
{
  "errorCode": "RESOURCE_NOT_FOUND",
  "message": "Document not found with GenId: GEN00000999",
  "timestamp": "2026-02-12T15:45:00",
  "path": "/api/document-tracker/GEN00000999/details",
  "correlationId": "abc-123"
}
```

---

### 3. Create Document (CREATE)
```
POST /api/document-tracker
```

**Request Body:**
```json
{
  "genId": "GEN00000051",
  "documentType": "INVOICE",
  "receivedAt": "2026-02-13T10:30:00"
}
```

**Response:**
```json
{
  "genId": "GEN00000051",
  "documentType": "INVOICE",
  "receivedAt": "2026-02-13T10:30:00",
  "createdAt": "2026-02-13T10:30:00",
  "createdBy": "CURRENT_USER",
  "modifiedAt": "2026-02-13T10:30:00",
  "modifiedBy": "CURRENT_USER"
}
```

**Status Code:** 201 Created

**Validation Rules:**
- `genId` - Required, must match pattern `GEN\d{8}` (e.g., GEN00000001)
- `documentType` - Required, string
- `receivedAt` - Required, ISO 8601 datetime format

**Error Response (409 Conflict):**
```json
{
  "errorCode": "DUPLICATE_RESOURCE",
  "message": "Document with GenId GEN00000001 already exists",
  "timestamp": "2026-02-13T10:30:00",
  "path": "/api/document-tracker",
  "correlationId": "abc-123"
}
```

---

### 4. Update Document (UPDATE)
```
PUT /api/document-tracker/{genId}
```

**Path Parameters:**
- `genId` - Document Gen ID (e.g., GEN00000001)

**Request Body:**
```json
{
  "documentType": "UPDATED_INVOICE",
  "receivedAt": "2026-02-13T14:30:00"
}
```

**Response:**
```json
{
  "genId": "GEN00000001",
  "documentType": "UPDATED_INVOICE",
  "receivedAt": "2026-02-13T14:30:00",
  "createdAt": "2026-01-15T10:30:00",
  "createdBy": "TEST_USER",
  "modifiedAt": "2026-02-13T14:30:00",
  "modifiedBy": "CURRENT_USER"
}
```

**Status Code:** 200 OK

**Error Response (404):**
```json
{
  "errorCode": "RESOURCE_NOT_FOUND",
  "message": "Document not found with GenId: GEN00000999",
  "timestamp": "2026-02-13T14:30:00",
  "path": "/api/document-tracker/GEN00000999",
  "correlationId": "abc-123"
}
```

---

### 5. Delete Document (DELETE)
```
DELETE /api/document-tracker/{genId}
```

**Path Parameters:**
- `genId` - Document Gen ID (e.g., GEN00000001)

**Response:** Empty body

**Status Code:** 204 No Content

**Error Response (404):**
```json
{
  "errorCode": "RESOURCE_NOT_FOUND",
  "message": "Document not found with GenId: GEN00000999",
  "timestamp": "2026-02-13T14:30:00",
  "path": "/api/document-tracker/GEN00000999",
  "correlationId": "abc-123"
}
```

---

## Test Data

**50 Pre-loaded Test Records**
- GenID Range: GEN00000001 to GEN00000050
- Document Types: INVOICE, PO, RECEIPT, SHIPPING, INSURANCE, LEGAL, FINANCIAL, COMPLIANCE, REPORT, CONTRACT
- Each document has 2-3 sub-documents with varying statuses
- Sub-Statuses: PROCESS_COMPLETED, PROCESS_FAILED, IN_PROGRESS
- Severity Mapping:
  - PROCESS_COMPLETED → SUCCESS (green)
  - PROCESS_FAILED → ERROR (red)
  - IN_PROGRESS → INFO (blue)

### Load Test Data

**Option 1: Using Java Initializer (Recommended)**
```bash
# Start backend with dev profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

**Option 2: Using SQL Script**
- `data.sql` is automatically loaded in dev profile
- Contains 50 document records with sub-documents

---

## Authorization

All endpoints check authorization before processing:

| Endpoint | Permission |
|----------|-----------|
| POST /search | RULE_VIEW | 
| GET /{genId}/details | RULE_VIEW |
| POST / | RULE_CREATE |
| PUT /{genId} | RULE_UPDATE |
| DELETE /{genId} | RULE_DELETE |

**Error Response (403 Forbidden):**
```json
{
  "errorCode": "ACCESS_DENIED",
  "message": "User john_doe not authorized for RULE_CREATE",
  "timestamp": "2026-02-13T10:30:00",
  "path": "/api/document-tracker",
  "correlationId": "abc-123"
}
```

---

## Audit Fields

All entities automatically track modification history:

```json
{
  "createdAt": "2026-01-15T10:30:00",
  "createdBy": "john_doe",
  "modifiedAt": "2026-02-13T14:30:00",
  "modifiedBy": "jane_smith"
}
```

---

## Filter Examples

### Filter by Document Type
```json
{
  "filters": {
    "documentType": "INVOICE"
  },
  "pagination": {
    "page": 0,
    "size": 10
  }
}
```

### Filter by Created User
```json
{
  "filters": {
    "createdBy": "TEST_USER"
  },
  "pagination": {
    "page": 0,
    "size": 10
  }
}
```

### Combined Filters with Sorting
```json
{
  "filters": {
    "documentType": "INVOICE",
    "createdBy": "TEST_USER"
  },
  "pagination": {
    "page": 0,
    "size": 20
  },
  "sort": [
    {
      "field": "receivedAt",
      "direction": "DESC"
    },
    {
      "field": "createdAt",
      "direction": "ASC"
    }
  ]
}
```

---

## Sorting

Supported sort fields:
- `genId`
- `documentType`
- `receivedAt`
- `createdAt`
- `createdBy`

Sort directions: `ASC`, `DESC`

---

## Pagination

**Request Parameters:**
- `page` - Page number (0-indexed)
- `size` - Items per page (default: 20, max: 100)

**Response Metadata:**
```json
{
  "pagination": {
    "currentPage": 0,
    "pageSize": 20,
    "totalElements": 50,
    "totalPages": 3
  }
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "errorCode": "ERROR_TYPE",
  "message": "Human-readable error message",
  "timestamp": "2026-02-13T14:30:00",
  "path": "/api/document-tracker/...",
  "correlationId": "unique-request-id"
}
```

### Common Error Codes

| Code | HTTP Status | Meaning |
|------|------------|---------|
| VALIDATION_ERROR | 400 | Invalid request format |
| RESOURCE_NOT_FOUND | 404 | Document doesn't exist |
| DUPLICATE_RESOURCE | 409 | GenId already exists |
| ACCESS_DENIED | 403 | Insufficient permissions |
| INTERNAL_SERVER_ERROR | 500 | Server-side error |

---

## Database Schema

### document_tracker Table
```sql
CREATE TABLE document_tracker (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  gen_id VARCHAR(255) UNIQUE NOT NULL,
  document_type VARCHAR(255),
  received_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  modified_at TIMESTAMP,
  modified_by VARCHAR(255)
);
```

### sub_document Table
```sql
CREATE TABLE sub_document (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  gen_id BIGINT NOT NULL,
  sub_id VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL,
  status_message VARCHAR(500),
  processed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  modified_at TIMESTAMP,
  modified_by VARCHAR(255),
  FOREIGN KEY (gen_id) REFERENCES document_tracker(id)
);
```

---

## Integration with Frontend

The frontend React application connects to these endpoints:

**API Client:** [documentTrackerApi.ts](../../frontend/src/features/document-tracker/api/documentTrackerApi.ts)

**Usage:**
```typescript
// Search documents
const results = await documentTrackerApi.search(filters, pagination, sort);

// Get details
const details = await documentTrackerApi.getDetails(genId);

// Create (new)
const created = await documentTrackerApi.create(request);

// Update (new)
const updated = await documentTrackerApi.update(genId, request);

// Delete (new)
await documentTrackerApi.delete(genId);

// Export
const blob = await documentTrackerApi.export(filters);
```

---

## Development Setup

**Requirements:**
- Java 21+
- Spring Boot 4.0.2
- H2 Database (development)

**Run with Test Data:**
```bash
# Start with dev profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

**Access H2 Console:**
```
http://localhost:8080/h2-console
```

---

## Performance Notes

- Search with filters: ~50ms (100 records)
- Get details with sub-documents: ~20ms
- Create new document: ~15ms
- Update document: ~10ms
- Delete document: ~10ms

**Pagination:** Default 20 items/page, max 100

---

## Future Enhancements

- [ ] Batch operations (create/update/delete multiple)
- [ ] Sub-document CRUD endpoints
- [ ] Export to CSV/XLSX
- [ ] Advanced search filters (date range)
- [ ] Document versioning
- [ ] Change audit trail
