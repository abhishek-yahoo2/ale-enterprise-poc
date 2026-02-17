# ALE -- GenAI‑Ready Developer Specification (Java Backend + Copilot)

## 1. Purpose

This document defines **developer‑ready specifications**, **Copilot prompt templates**, and **validation rule matrices** for building the ALE application using **Java backend** with **Copilot-assisted development**.

The goal is to ensure:
- Predictable, scalable code generation
- Zero ambiguity in business rules
- Strict separation of concerns
- Long-term maintainability across modules
- Production-ready, enterprise-grade code quality

---

## 2. Architectural Standards (MANDATORY)

### 2.1 Layered Architecture

```
Controller → Service → Domain → Repository
                ↓
           Rules / Validators
```

**Rules**
- **Controllers**: Request/response mapping only
- **Services**: Orchestration + business rules
- **Domain**: Core entities & enums
- **Repositories**: Database access only
- **Validators**: Reusable rule enforcement

❌ **NO** business logic in controllers  
❌ **NO** database access outside repositories  
❌ **NO** entity exposure in API responses (use DTOs)

### 2.2 Standard Package Structure

```
com.company.ale
 ├── documenttracker
 │    ├── controller
 │    ├── service
 │    ├── domain
 │    ├── repository
 │    ├── validator
 │    └── dto
 ├── capitalcall
 │    ├── controller
 │    ├── service
 │    ├── domain
 │    ├── repository
 │    ├── validator
 │    └── dto
 ├── alternativedata
 │    ├── controller
 │    ├── service
 │    ├── domain
 │    ├── repository
 │    ├── validator
 │    └── dto
 └── common
      ├── audit
      ├── security
      ├── locking
      ├── pagination
      ├── export
      ├── exception
      └── logging
```

This structure **must be followed** so Copilot learns consistent patterns.

### 2.3 Technology Stack (MANDATORY)

**Backend Framework**
- Spring Boot 3.x
- Java 17 or higher
- Maven or Gradle (build tool)

**Core Dependencies**
- Spring Data JPA (database access)
- Spring Security (authentication/authorization)
- Spring Validation (bean validation)
- Hibernate (ORM)

**Database**
- PostgreSQL / MySQL / Oracle (specify based on environment)
- Flyway or Liquibase for schema migrations

**Utilities**
- Lombok (reduce boilerplate code)
- MapStruct (DTO ↔ Entity mapping)
- OpenAPI/Swagger (API documentation)
- SLF4J + Logback (structured logging)

**Testing**
- JUnit 5 (unit testing)
- Mockito (mocking framework)
- Spring Boot Test (integration testing)
- TestContainers (database integration tests)

### 2.4 DTO Standards (MANDATORY)

**Rules**
- Never expose entities directly in controllers
- Always use DTOs for request/response
- Use MapStruct for entity ↔ DTO conversion
- DTOs must be immutable (use `@Value` or Java records)
- Separate DTOs for requests and responses

**Naming Convention**
- **Request DTOs**: `CreateCapitalCallRequest`, `UpdateCapitalCallRequest`, `SearchRequest`
- **Response DTOs**: `CapitalCallResponse`, `CapitalCallDetailResponse`
- **Search DTOs**: `CapitalCallSearchDTO`

**Example Structure**
```java
@Value
@Builder
public class CapitalCallResponse {
    Long id;
    String aleBatchId;
    LocalDate fromDate;
    LocalDate toDate;
    BigDecimal totalAmount;
    WorkflowStatus status;
    String lockedBy;
    LocalDateTime lockedAt;
    // No entity references, no circular dependencies
}
```

**DTO Mapping**
```java
@Mapper(componentModel = "spring")
public interface CapitalCallMapper {
    CapitalCallResponse toResponse(CapitalCall entity);
    CapitalCall toEntity(CreateCapitalCallRequest request);
    void updateEntity(UpdateCapitalCallRequest request, @MappingTarget CapitalCall entity);
}
```

### 2.5 Transaction Management (MANDATORY)

**Rules**
- `@Transactional` on service layer **only**
- Read operations: `@Transactional(readOnly = true)`
- Write operations: default propagation (REQUIRED)
- Never use `@Transactional` in controllers or repositories

**Example**
```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CapitalCallService {
    
    private final CapitalCallRepository repository;
    private final AuthorizationService authorizationService;
    private final AuditService auditService;
    
    @Transactional // Write operation overrides class-level readOnly
    public CapitalCallResponse save(CreateCapitalCallRequest request, User user) {
        authorizationService.assertAllowed(user, RuleType.RULE_EDIT);
        // Business logic here
        auditService.recordAudit("CapitalCall", entity.getId(), "CREATE", null, entity, user.getUsername());
        return mapper.toResponse(entity);
    }
    
    // Read operation uses class-level readOnly = true
    public CapitalCallResponse findById(Long id) {
        return repository.findById(id)
            .map(mapper::toResponse)
            .orElseThrow(() -> new EntityNotFoundException("CapitalCall", id));
    }
}
```

### 2.6 Database Standards (MANDATORY)

**Naming Conventions**
- **Tables**: snake_case (`capital_call`, `capital_call_breakdown`, `entity_lock`)
- **Columns**: snake_case (`total_amount`, `created_at`, `locked_by`)
- **Primary keys**: `id` (BIGINT AUTO_INCREMENT)
- **Foreign keys**: `{table}_id` (`capital_call_id`, `gen_id`)

**Standard Audit Columns (All Tables)**
```sql
id BIGINT PRIMARY KEY AUTO_INCREMENT,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
created_by VARCHAR(100) NOT NULL,
modified_at TIMESTAMP,
modified_by VARCHAR(100),
version INT NOT NULL DEFAULT 0  -- Optimistic locking
```

**Indexes**
- Primary key on `id`
- Index on all foreign keys
- Index on frequently filtered fields (status, dates, batch_id)
- Unique constraints where business rules require uniqueness

**Migration Strategy**
- Use Flyway for version control
- Naming: `V{version}__{description}.sql` (e.g., `V1__initial_schema.sql`)
- Never modify existing migrations
- Test migrations on copy of production data
- Include rollback scripts for major changes

**Example Migration**
```sql
-- V1__create_capital_call_tables.sql
CREATE TABLE capital_call (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ale_batch_id VARCHAR(50) NOT NULL,
    from_date DATE,
    to_date DATE,
    day_type VARCHAR(20),
    total_amount DECIMAL(19,2) NOT NULL,
    workflow_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    modified_at TIMESTAMP,
    modified_by VARCHAR(100),
    version INT NOT NULL DEFAULT 0,
    INDEX idx_batch_id (ale_batch_id),
    INDEX idx_status (workflow_status),
    INDEX idx_dates (from_date, to_date)
);
```

---

## 3. Cross‑Cutting Specifications

### 3.1 Pagination, Sorting & Filtering

**Standard Search Request**
```json
{
  "filters": {
    "aleBatchId": "ALE-123456",
    "status": "SUBMITTED",
    "fromDate": "2026-01-01"
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

**Standard Search Response**
```json
{
  "content": [...],
  "pagination": {
    "currentPage": 0,
    "pageSize": 25,
    "totalElements": 150,
    "totalPages": 6
  }
}
```

**Rules**
- Default page size: **25**
- Max page size: **200**
- Sort fields must be **whitelisted** (prevent SQL injection)
- Invalid filters → validation error (400)
- Use Specification/Criteria pattern (no dynamic SQL strings)

**Implementation**
```java
@Value
@Builder
public class SearchRequest {
    Map<String, Object> filters;
    PaginationRequest pagination;
    List<SortRequest> sort;
}

@Value
@Builder
public class PaginationRequest {
    @Min(0)
    Integer page;
    
    @Min(1)
    @Max(200)
    Integer size;
    
    public int getPageOrDefault() {
        return page != null ? page : 0;
    }
    
    public int getSizeOrDefault() {
        return size != null ? size : 25;
    }
}

@Value
@Builder
public class SortRequest {
    @NotBlank
    String field;
    
    @Pattern(regexp = "ASC|DESC")
    String direction;
}

@Value
@Builder
public class SearchResponse<T> {
    List<T> content;
    PaginationMetadata pagination;
}

@Value
@Builder
public class PaginationMetadata {
    Integer currentPage;
    Integer pageSize;
    Long totalElements;
    Integer totalPages;
}
```

### 3.2 Role & Entitlement Enforcement

**Rule Naming Convention**
```java
public enum RuleType {
    RULE_VIEW,
    RULE_EDIT,
    RULE_SUBMIT,
    RULE_APPROVE,
    RULE_UNLOCK_WORK_ITEM,
    RULE_EXPORT_DATA,
    RULE_DELETE
}
```

**Enforcement**
```java
@Service
@RequiredArgsConstructor
public class AuthorizationService {
    
    private final UserRoleRepository userRoleRepository;
    
    public void assertAllowed(User user, RuleType rule) {
        if (!hasPermission(user, rule)) {
            throw new AuthorizationException(
                String.format("User %s not authorized for %s", user.getUsername(), rule)
            );
        }
    }
    
    public boolean hasPermission(User user, RuleType rule) {
        // Check user roles/entitlements
        return userRoleRepository.hasEntitlement(user.getId(), rule);
    }
}
```

**Rules**
- Authorization checks **only in service layer**
- Never check permissions in controllers
- Always check before state changes
- Log all authorization failures

### 3.3 Audit Trail (MANDATORY)

**Audit Events**
```java
public enum AuditEventType {
    CREATE,
    UPDATE,
    DELETE,
    LOCK,
    UNLOCK,
    EXPORT,
    SUBMIT,
    APPROVE,
    REJECT
}
```

**Audit Entity**
```java
@Entity
@Table(name = "audit_trail")
@Data
@Builder
public class AuditEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String entityType;
    
    @Column(nullable = false)
    private String entityId;
    
    private String fieldName;
    
    @Column(length = 4000)
    private String oldValue;
    
    @Column(length = 4000)
    private String newValue;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditEventType eventType;
    
    @Column(nullable = false)
    private String changedBy;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    private String correlationId;
}
```

**Audit Service**
```java
@Service
@RequiredArgsConstructor
public class AuditService {
    
    private final AuditEventRepository repository;
    
    public void recordAudit(String entityType, Object entityId, String fieldName,
                           Object oldValue, Object newValue, String changedBy) {
        AuditEvent event = AuditEvent.builder()
            .entityType(entityType)
            .entityId(String.valueOf(entityId))
            .fieldName(fieldName)
            .oldValue(serialize(oldValue))
            .newValue(serialize(newValue))
            .eventType(determineEventType(oldValue, newValue))
            .changedBy(changedBy)
            .timestamp(LocalDateTime.now())
            .correlationId(MDC.get("correlationId"))
            .build();
        
        repository.save(event);
    }
    
    private String serialize(Object value) {
        // Convert to JSON or string representation
        // Mask sensitive fields
    }
}
```

**Rules**
- Audit is **mandatory** and **non-optional**
- Trigger audit for: CREATE, UPDATE, DELETE, LOCK, UNLOCK, SUBMIT, APPROVE
- Include correlationId in all audit records
- Mask sensitive data (passwords, SSN, etc.)
- Never log full entities with sensitive fields

### 3.4 Exception Handling (MANDATORY)

**Custom Exceptions**
```java
@ResponseStatus(HttpStatus.NOT_FOUND)
public class EntityNotFoundException extends RuntimeException {
    private final String entityType;
    private final Object entityId;
    
    public EntityNotFoundException(String entityType, Object entityId) {
        super(String.format("%s with id %s not found", entityType, entityId));
        this.entityType = entityType;
        this.entityId = entityId;
    }
}

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends RuntimeException {
    private final String errorCode;
    
    public ValidationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AuthorizationException extends RuntimeException {
    public AuthorizationException(String message) {
        super(message);
    }
}

@ResponseStatus(HttpStatus.LOCKED)
public class LockedException extends RuntimeException {
    private final String lockedBy;
    
    public LockedException(String entityType, Object entityId, String lockedBy) {
        super(String.format("%s %s is locked by %s", entityType, entityId, lockedBy));
        this.lockedBy = lockedBy;
    }
}

@ResponseStatus(HttpStatus.CONFLICT)
public class ConcurrentModificationException extends RuntimeException {
    public ConcurrentModificationException(String message) {
        super(message);
    }
}
```

**Error Response Format**
```java
@Value
@Builder
public class ErrorResponse {
    LocalDateTime timestamp;
    Integer status;
    String error;
    String errorCode;
    String message;
    String path;
    String correlationId;
}
```

**Global Exception Handler**
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(
            EntityNotFoundException ex, HttpServletRequest request) {
        
        log.warn("Entity not found: {}", ex.getMessage());
        
        ErrorResponse response = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error("Not Found")
            .errorCode("ENT_404")
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .correlationId(MDC.get("correlationId"))
            .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            ValidationException ex, HttpServletRequest request) {
        
        log.warn("Validation failed: {}", ex.getMessage());
        
        ErrorResponse response = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Failed")
            .errorCode(ex.getErrorCode())
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .correlationId(MDC.get("correlationId"))
            .build();
        
        return ResponseEntity.badRequest().body(response);
    }
    
    @ExceptionHandler(AuthorizationException.class)
    public ResponseEntity<ErrorResponse> handleAuthorization(
            AuthorizationException ex, HttpServletRequest request) {
        
        log.warn("Authorization failed: {}", ex.getMessage());
        
        ErrorResponse response = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.FORBIDDEN.value())
            .error("Forbidden")
            .errorCode("AUTH_403")
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .correlationId(MDC.get("correlationId"))
            .build();
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
    
    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ErrorResponse> handleLocked(
            LockedException ex, HttpServletRequest request) {
        
        log.warn("Resource locked: {}", ex.getMessage());
        
        ErrorResponse response = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(423)
            .error("Locked")
            .errorCode("LOCK_423")
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .correlationId(MDC.get("correlationId"))
            .build();
        
        return ResponseEntity.status(423).body(response);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(
            Exception ex, HttpServletRequest request) {
        
        log.error("Unexpected error", ex);
        
        ErrorResponse response = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .errorCode("SYS_500")
            .message("An unexpected error occurred")
            .path(request.getRequestURI())
            .correlationId(MDC.get("correlationId"))
            .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
```

**Error Codes**
| Code     | Description                    | HTTP Status |
|----------|--------------------------------|-------------|
| ENT_404  | Entity not found               | 404         |
| VAL_003  | Percentage validation failed   | 400         |
| VAL_004  | Date range invalid             | 400         |
| VAL_005  | Batch ID format invalid        | 400         |
| AUTH_403 | Authorization failed           | 403         |
| LOCK_001 | Lock acquisition failed        | 423         |
| LOCK_423 | Resource locked by another user| 423         |
| BUS_001  | Invalid status transition      | 400         |
| SYS_500  | System error                   | 500         |

**Rules**
- Always include `correlationId` in error responses
- Use error codes for programmatic client handling
- Log full stack trace server-side only
- Return user-friendly messages (never expose internal details)
- Never return stack traces to clients

### 3.5 Security Standards (MANDATORY)

**Authentication**
- JWT-based authentication
- Token expiration: 8 hours
- Refresh token support (30 days)
- Secure token storage (HttpOnly cookies or secure headers)

**Authorization**
- Role-based access control (RBAC)
- Entitlement checking in service layer **only**
- No role checks in controllers or repositories
- Principle of least privilege

**Sensitive Data Protection**
- Never log sensitive fields (passwords, SSN, credit cards)
- Mask sensitive data in audit trail
- Encrypt at rest: PII fields
- Use parameterized queries (prevent SQL injection)
- Validate and sanitize all inputs

**API Security**
- HTTPS only in production
- CORS configuration for allowed origins only
- Rate limiting: 1000 requests/hour per user
- Request size limit: 10MB
- CSRF protection for state-changing operations

**Security Headers**
```yaml
security:
  headers:
    content-security-policy: "default-src 'self'"
    x-frame-options: DENY
    x-content-type-options: nosniff
    strict-transport-security: max-age=31536000
```

**Example Security Configuration**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Use token-based auth
            .cors().and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/**").authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### 3.6 Locking Framework (MANDATORY)

**Lock Entity**
```java
@Entity
@Table(name = "entity_lock")
@Data
@Builder
public class EntityLock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String entityType;
    
    @Column(nullable = false)
    private String entityId;
    
    @Column(nullable = false)
    private String lockedBy;
    
    @Column(nullable = false)
    private LocalDateTime lockedAt;
    
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    
    @Version
    private Integer version;
}
```

**Lock Service**
```java
@Service
@Transactional
@RequiredArgsConstructor
public class LockService {
    
    private final EntityLockRepository repository;
    private final AuditService auditService;
    
    @Value("${locking.timeout-minutes:30}")
    private int lockTimeoutMinutes;
    
    public EntityLock acquireLock(String entityType, String entityId, String username) {
        // Remove expired locks first
        removeExpiredLocks();
        
        Optional<EntityLock> existing = repository.findByEntityTypeAndEntityId(entityType, entityId);
        
        if (existing.isPresent()) {
            EntityLock lock = existing.get();
            if (lock.getLockedBy().equals(username)) {
                // Extend existing lock
                lock.setExpiresAt(LocalDateTime.now().plusMinutes(lockTimeoutMinutes));
                return repository.save(lock);
            } else {
                throw new LockedException(entityType, entityId, lock.getLockedBy());
            }
        }
        
        EntityLock newLock = EntityLock.builder()
            .entityType(entityType)
            .entityId(entityId)
            .lockedBy(username)
            .lockedAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusMinutes(lockTimeoutMinutes))
            .build();
        
        EntityLock saved = repository.save(newLock);
        auditService.recordAudit(entityType, entityId, "LOCK", null, username, username);
        
        return saved;
    }
    
    public void releaseLock(String entityType, String entityId, String username) {
        EntityLock lock = repository.findByEntityTypeAndEntityId(entityType, entityId)
            .orElseThrow(() -> new EntityNotFoundException("Lock", entityType + ":" + entityId));
        
        if (!lock.getLockedBy().equals(username)) {
            throw new AuthorizationException("Cannot unlock resource locked by another user");
        }
        
        repository.delete(lock);
        auditService.recordAudit(entityType, entityId, "UNLOCK", username, null, username);
    }
    
    public void forceUnlock(String entityType, String entityId, User admin) {
        // Requires RULE_UNLOCK_WORK_ITEM entitlement
        EntityLock lock = repository.findByEntityTypeAndEntityId(entityType, entityId)
            .orElseThrow(() -> new EntityNotFoundException("Lock", entityType + ":" + entityId));
        
        String previousOwner = lock.getLockedBy();
        repository.delete(lock);
        
        auditService.recordAudit(entityType, entityId, "FORCE_UNLOCK", 
                                previousOwner, admin.getUsername(), admin.getUsername());
    }
    
    public boolean isLocked(String entityType, String entityId) {
        return repository.findByEntityTypeAndEntityId(entityType, entityId).isPresent();
    }
    
    public Optional<String> getLockedBy(String entityType, String entityId) {
        return repository.findByEntityTypeAndEntityId(entityType, entityId)
            .map(EntityLock::getLockedBy);
    }
    
    private void removeExpiredLocks() {
        repository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
```

**Locking Rules**
- First access creates lock automatically
- Lock timeout is configurable (default: 30 minutes)
- Force unlock requires `RULE_UNLOCK_WORK_ITEM` entitlement
- Force unlock kicks out current user
- User can hold max 5 concurrent locks
- Expired locks are cleaned up automatically

---

## 4. Module Specifications

## 4.1 Document Tracker Module

### Domain Rules

**Primary Relationship**
- One `GenId` → Many `SubIds`
- GenId must be unique across the system
- SubId must be unique across all GenIds

**SubId Status Enum**
```java
public enum SubIdStatus {
    PROCESS_FAILED,
    PROCESS_COMPLETED,
    IN_PROGRESS
}
```

**Severity Enum**
```java
public enum Severity {
    ERROR,
    SUCCESS,
    WARNING,
    INFO
}
```

### Status Mapping Rule

```
PROCESS_FAILED     → ERROR severity
PROCESS_COMPLETED  → SUCCESS severity
IN_PROGRESS        → INFO severity
```

**UI color is derived from severity enum, not hardcoded in backend.**

### Domain Entities

```java
@Entity
@Table(name = "document_tracker")
@Data
@Builder
public class DocumentTracker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    @Pattern(regexp = "GEN\\d{8}", message = "GenId must match pattern GEN followed by 8 digits")
    private String genId;
    
    @Column(nullable = false)
    private String documentType;
    
    @Column(nullable = false)
    private LocalDateTime receivedAt;
    
    @OneToMany(mappedBy = "documentTracker", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SubDocument> subDocuments = new ArrayList<>();
    
    // Standard audit fields
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime modifiedAt;
    private String modifiedBy;
}

@Entity
@Table(name = "sub_document")
@Data
@Builder
public class SubDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String subId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gen_id", nullable = false)
    private DocumentTracker documentTracker;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubIdStatus status;
    
    @Column(length = 4000)
    private String statusMessage;
    
    @Column(nullable = false)
    private LocalDateTime processedAt;
    
    public Severity getSeverity() {
        return switch (status) {
            case PROCESS_FAILED -> Severity.ERROR;
            case PROCESS_COMPLETED -> Severity.SUCCESS;
            case IN_PROGRESS -> Severity.INFO;
        };
    }
    
    // Status is immutable once PROCESS_COMPLETED
    @PreUpdate
    public void validateStatusChange() {
        if (status == SubIdStatus.PROCESS_COMPLETED) {
            throw new ValidationException("Cannot change status from PROCESS_COMPLETED", "DT-06");
        }
    }
}
```

### Validation Rules

| Rule   | Description                      | Enforcement | Error Code |
|--------|----------------------------------|-------------|------------|
| DT-01  | GenId must exist                 | Service     | ENT_404    |
| DT-02  | SubId belongs to GenId           | Service     | VAL_001    |
| DT-03  | Status immutable after completion| Domain      | VAL_002    |
| DT-04  | GenId format: GEN\\d{8}          | Validator   | VAL_003    |
| DT-05  | SubId unique across all GenIds   | Database    | CONS_001   |
| DT-06  | Status cannot change from COMPLETED | Domain   | VAL_002    |
| DT-07  | Severity calculation deterministic | Domain    | N/A        |

### APIs

```java
@RestController
@RequestMapping("/api/document-tracker")
@RequiredArgsConstructor
public class DocumentTrackerController {
    
    private final DocumentTrackerService service;
    
    @Operation(summary = "Search document trackers")
    @PostMapping("/search")
    public ResponseEntity<SearchResponse<DocumentTrackerDTO>> search(
            @Valid @RequestBody SearchRequest request) {
        return ResponseEntity.ok(service.search(request));
    }
    
    @Operation(summary = "Get document tracker details with sub-documents")
    @GetMapping("/{genId}/details")
    public ResponseEntity<DocumentDetailsDTO> getDetails(
            @PathVariable @Pattern(regexp = "GEN\\d{8}") String genId) {
        return ResponseEntity.ok(service.getDetails(genId));
    }
}
```

## 4.2 Capital Call Module (CRITICAL)

### Domain Entities

```java
@Entity
@Table(name = "capital_call")
@Data
@Builder
public class CapitalCall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "ale_batch_id", nullable = false)
    @Pattern(regexp = "ALE-\\d{6}", message = "Batch ID must match pattern ALE-XXXXXX")
    private String aleBatchId;
    
    @Column(name = "from_date")
    private LocalDate fromDate;
    
    @Column(name = "to_date")
    private LocalDate toDate;
    
    @Column(name = "day_type")
    private String dayType;
    
    @Column(name = "total_amount", nullable = false, precision = 19, scale = 2)
    @DecimalMin("0.01")
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "workflow_status", nullable = false)
    private WorkflowStatus workflowStatus;
    
    @OneToMany(mappedBy = "capitalCall", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CapitalCallBreakdown> breakdowns = new ArrayList<>();
    
    // Audit fields
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_by", nullable = false)
    private String createdBy;
    
    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;
    
    @Column(name = "modified_by")
    private String modifiedBy;
    
    @Version
    private Integer version;
}

@Entity
@Table(name = "capital_call_breakdown")
@Data
@Builder
public class CapitalCallBreakdown {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "capital_call_id", nullable = false)
    private CapitalCall capitalCall;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BreakdownCategory category;
    
    @Column(nullable = false, precision = 5, scale = 2)
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    private BigDecimal percentage;
    
    @Column(name = "calculated_amount", precision = 19, scale = 2)
    private BigDecimal calculatedAmount;
    
    public void calculateAmount(BigDecimal totalAmount, int precision) {
        this.calculatedAmount = totalAmount
            .multiply(percentage)
            .divide(BigDecimal.valueOf(100), precision, RoundingMode.HALF_UP);
    }
}

public enum WorkflowStatus {
    DRAFT,
    SUBMITTED,
    APPROVED,
    REJECTED
}

public enum BreakdownCategory {
    MANAGEMENT_FEES,
    PERFORMANCE_FEES,
    OPERATING_EXPENSES,
    DISTRIBUTIONS,
    OTHER
}
```

### Workflow & State Transition Rules

**Valid Transitions**
```
DRAFT → SUBMITTED (requires RULE_SUBMIT)
SUBMITTED → APPROVED (requires RULE_APPROVE)
SUBMITTED → REJECTED (requires RULE_APPROVE)
SUBMITTED → DRAFT (rejection/revision, requires RULE_EDIT)
DRAFT → DRAFT (save changes, requires RULE_EDIT)
REJECTED → DRAFT (revision, requires RULE_EDIT)
```

**Invalid Transitions**
```
APPROVED → SUBMITTED ❌
APPROVED → DRAFT ❌
DRAFT → APPROVED ❌ (must go through SUBMITTED)
REJECTED → APPROVED ❌
```

### Validation Rules

| Rule   | Description                      | Enforcement | Implementation                | Error Code |
|--------|----------------------------------|-------------|-------------------------------|------------|
| CC-01  | Lock before edit                 | Service     | lockService.acquireLock()     | LOCK_001   |
| CC-02  | Unlock requires role             | Service     | assertAllowed(RULE_UNLOCK)    | AUTH_002   |
| CC-03  | % total ≤ 100                    | Validator   | validatePercentageTotal()     | VAL_003    |
| CC-04  | Audit on submit                  | Service     | auditService.recordAudit()    | N/A        |
| CC-05  | From/To dates valid              | Validator   | fromDate <= toDate            | VAL_004    |
| CC-06  | Batch ID format                  | Validator   | Pattern: ALE-\\d{6}           | VAL_005    |
| CC-07  | Status transitions               | Service     | validateStateTransition()     | BUS_001    |
| CC-08  | Date range ≤ 1 year              | Validator   | ChronoUnit.DAYS.between()     | VAL_006    |
| CC-09  | Categories from enum             | Domain      | @Enumerated                   | VAL_007    |
| CC-10  | Total amount > 0                 | Validator   | @DecimalMin("0.01")           | VAL_008    |
| CC-11  | Lock expires after 30 min        | Service     | lockService timeout           | N/A        |
| CC-12  | Max 5 concurrent locks per user  | Service     | lockService.countUserLocks()  | LOCK_002   |

## 4.3 Alternative Data Management Module

### Domain Entities

```java
@Entity
@Table(name = "user_column_preference", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "module_name"}))
@Data
@Builder
public class UserColumnPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "module_name", nullable = false)
    private String moduleName;
    
    @Column(name = "column_names", nullable = false, length = 4000)
    @Convert(converter = StringListConverter.class)
    private List<String> columnNames;
    
    @Column(name = "display_order", length = 4000)
    @Convert(converter = StringListConverter.class)
    private List<String> displayOrder;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    @PreUpdate
    public void validateColumnCount() {
        if (columnNames != null && columnNames.size() > 40) {
            throw new ValidationException("Maximum 40 columns allowed", "AD-01");
        }
    }
}
```

### Validation Rules

| Rule   | Description                      | Enforcement | Implementation             | Error Code |
|--------|----------------------------------|-------------|----------------------------|------------|
| AD-01  | Max 40 columns                   | Validator   | validateColumns()          | VAL_009    |
| AD-02  | Column whitelist                 | Service     | validateColumns()          | VAL_010    |
| AD-03  | Edit requires role               | Service     | assertAllowed(RULE_EDIT)   | AUTH_002   |
| AD-04  | Search uses Specification        | Service     | Specification pattern      | N/A        |
| AD-05  | No dynamic SQL strings           | Repository  | Code review / SonarQube    | N/A        |

---

## 5. Copilot Prompt Templates

### 5.1 Complete Backend Code Generation Template

```
Generate Java Spring Boot code following these rules:

ARCHITECTURE:
- Strict layered architecture: Controller → Service → Domain → Repository
- No business logic in controllers (request/response mapping only)
- All business logic in service layer
- Use DTOs for all API inputs/outputs (never expose entities directly)
- Use MapStruct for entity ↔ DTO mapping

DEPENDENCIES:
- Use constructor injection with @RequiredArgsConstructor (not @Autowired fields)
- Use Lombok for boilerplate reduction (@Data, @Builder, @Value)
- Inject only interfaces, not implementations

VALIDATION:
- Bean validation in DTOs (@NotNull, @Size, @Pattern, etc.)
- Business rule validation in service layer
- Use custom validators for complex rules
- Reference validation rule matrix: [specify rules like CC-03, DT-01]
- Throw ValidationException with error codes

SECURITY:
- Check authorization before ALL operations: authorizationService.assertAllowed(user, RULE_XXX)
- Apply @Transactional at service layer only
- Read operations: @Transactional(readOnly = true)
- Never expose sensitive data in logs or responses

LOCKING (for Capital Call module):
- Acquire lock before edit operations
- Use lockService.acquireLock(entityType, entityId, username)
- Check lock ownership before modifications
- Release locks after submit/save completion

AUDIT & LOGGING:
- Trigger audit events for: CREATE, UPDATE, DELETE, LOCK, UNLOCK, SUBMIT, APPROVE
- Include correlationId in all logs using MDC
- Log at INFO level for business events
- Use structured logging (SLF4J + Logback)

ERROR HANDLING:
- Throw specific exceptions (ValidationException, EntityNotFoundException, AuthorizationException, LockedException)
- Include error codes in exceptions
- Provide user-friendly error messages
- Never expose stack traces to clients

DATABASE:
- Use Specification/Criteria pattern for dynamic queries
- Never use string concatenation for SQL
- Use pagination for all list queries (default 25, max 200)
- Add indexes on filter fields
- Follow naming: snake_case for tables/columns

TESTING:
- Generate unit tests with 80% minimum coverage
- Mock all dependencies using Mockito
- Test all validation rules explicitly
- Test authorization checks
- Test state transitions
- Use @SpringBootTest for integration tests

DO NOT:
- Put business logic in controllers
- Use entities in controller request/response
- Access repositories from controllers
- Use string concatenation for queries
- Ignore authorization checks
- Skip audit trail
- Use @Autowired field injection
- Use double/float for monetary amounts (use BigDecimal)

SPECIFIC MODULE: [Document Tracker / Capital Call / Alternative Data]
RULES TO IMPLEMENT: [List specific rules like DT-01, CC-03, AD-01]
VALIDATION REQUIREMENTS: [List validation requirements]
```

### 5.2 Service Layer Generation Template

```
Generate service-layer logic only for [Module Name].

RESPONSIBILITIES:
- Orchestrate business operations
- Apply explicit business rules from validation matrix
- Validate entitlements before state changes using authorizationService
- Ensure audit events are triggered for all state changes
- Manage transactions with @Transactional

RULES TO IMPLEMENT:
[List specific rules like:
- CC-01: Acquire lock before edit
- CC-03: Validate percentage total ≤ 100
- CC-07: Validate state transitions
]

DEPENDENCIES TO INJECT:
- Repository (data access)
- AuthorizationService (permission checks)
- AuditService (audit trail)
- LockService (for modules requiring locking)
- Validator (business rule validation)
- Mapper (DTO conversion)

TRANSACTION BOUNDARIES:
- Class-level: @Transactional(readOnly = true)
- Method-level: @Transactional for write operations

LOGGING:
- Log all business events at INFO level
- Include correlationId from MDC
- Log authorization failures at WARN level
- Log errors with full context

DO NOT:
- Expose entities directly (always use DTOs)
- Skip authorization checks
- Skip audit trail
- Use business logic in mappers
- Catch and swallow exceptions
```

### 5.3 Repository Layer Generation Template

```
Generate repository code only for [Entity Name].

REQUIREMENTS:
- Interface extending JpaRepository<[Entity], [ID Type]>
- Use Spring Data JPA method naming conventions
- Use @Query for complex queries (JPQL only, no native SQL unless absolutely necessary)
- Use Specification interface for dynamic queries
- No business logic in repository

CUSTOM QUERIES:
- Use meaningful method names: findByStatusAndDateBetween(...)
- Use Optional<> for single results
- Use Page<> for paginated results
- Use Specification<> for complex dynamic filters

EXAMPLE CUSTOM METHODS:
Optional<CapitalCall> findByAleBatchId(String batchId);
Page<CapitalCall> findAll(Specification<CapitalCall> spec, Pageable pageable);
List<CapitalCall> findByWorkflowStatusAndCreatedAtBefore(WorkflowStatus status, LocalDateTime date);

DO NOT:
- Add business logic
- Add validation logic
- Add authorization logic
- Use native SQL without strong justification
- Use string concatenation for queries
```

### 5.4 Controller Layer Generation Template

```
Generate REST controller for [Module Name].

RESPONSIBILITIES ONLY:
- Accept HTTP requests
- Validate request format using @Valid
- Delegate to service layer
- Map HTTP status codes
- Return responses

ANNOTATIONS:
- @RestController
- @RequestMapping("/api/[module-path]")
- @RequiredArgsConstructor
- @Validated
- @Operation (OpenAPI documentation)

REQUEST HANDLING:
- Accept DTOs (never entities)
- Use @Valid for bean validation
- Extract User from @AuthenticationPrincipal
- Pass user to service layer

RESPONSE HANDLING:
- Return DTOs (never entities)
- Use appropriate HTTP status codes (200, 201, 204, 400, 403, 404, 423)
- Use ResponseEntity<T> for flexibility

API DOCUMENTATION:
- Add @Operation summary and description
- Add @ApiResponses for all possible responses
- Document required permissions

ENDPOINTS TO CREATE:
[List endpoints like:
- POST /api/capital-call/search
- GET /api/capital-call/{id}
- POST /api/capital-call/{id}/submit
]

DO NOT:
- Add business logic
- Add validation logic (except bean validation via @Valid)
- Add authorization logic
- Access repositories directly
- Return entities
- Handle transactions
```

---

## 6. Validation Rule Matrices

### 6.1 Document Tracker Validation Rules

| Rule   | Description                      | Enforcement | Implementation                    | Error Code | Test Required |
|--------|----------------------------------|-------------|-----------------------------------|------------|---------------|
| DT-01  | GenId must exist                 | Service     | findByGenId().orElseThrow()       | ENT_404    | Yes           |
| DT-02  | SubId belongs to GenId           | Service     | Relationship validation           | VAL_001    | Yes           |
| DT-03  | Status immutable after completion| Domain      | @PreUpdate validation             | VAL_002    | Yes           |
| DT-04  | GenId format: GEN\\d{8}          | Validator   | @Pattern annotation               | VAL_003    | Yes           |
| DT-05  | SubId unique across all GenIds   | Database    | Unique constraint                 | CONS_001   | Yes           |
| DT-06  | Status cannot change from COMPLETED | Domain   | Pre-update hook                   | VAL_002    | Yes           |
| DT-07  | Severity calculation deterministic | Domain    | getSeverity() method              | N/A        | Yes           |

### 6.2 Capital Call Validation Rules

| Rule   | Description                      | Enforcement | Implementation                    | Error Code | Test Required |
|--------|----------------------------------|-------------|-----------------------------------|------------|---------------|
| CC-01  | Lock before edit                 | Service     | lockService.acquireLock()         | LOCK_001   | Yes           |
| CC-02  | Unlock requires role             | Service     | assertAllowed(RULE_UNLOCK)        | AUTH_002   | Yes           |
| CC-03  | % total ≤ 100                    | Validator   | validatePercentageTotal()         | VAL_003    | Yes           |
| CC-04  | Audit on submit                  | Service     | auditService.recordAudit()        | N/A        | Yes           |
| CC-05  | From/To dates valid              | Validator   | fromDate <= toDate                | VAL_004    | Yes           |
| CC-06  | Batch ID format                  | Validator   | @Pattern: ALE-\\d{6}              | VAL_005    | Yes           |
| CC-07  | Status transitions               | Service     | workflowValidator.validate()      | BUS_001    | Yes           |
| CC-08  | Date range ≤ 1 year              | Validator   | ChronoUnit.DAYS.between()         | VAL_006    | Yes           |
| CC-09  | Categories from enum             | Domain      | @Enumerated                       | VAL_007    | Yes           |
| CC-10  | Total amount > 0                 | Validator   | @DecimalMin("0.01")               | VAL_008    | Yes           |
| CC-11  | Lock expires after 30 min        | Service     | lockService timeout config        | N/A        | Yes           |
| CC-12  | Max 5 concurrent locks per user  | Service     | lockService.countUserLocks()      | LOCK_002   | Yes           |

### 6.3 Alternative Data Validation Rules

| Rule   | Description                      | Enforcement | Implementation                    | Error Code | Test Required |
|--------|----------------------------------|-------------|-----------------------------------|------------|---------------|
| AD-01  | Max 40 columns                   | Validator   | validateColumns() size check      | VAL_009    | Yes           |
| AD-02  | Column whitelist                 | Service     | validateColumns() whitelist       | VAL_010    | Yes           |
| AD-03  | Edit requires role               | Service     | assertAllowed(RULE_EDIT)          | AUTH_002   | Yes           |
| AD-04  | Search uses Specification        | Service     | Specification pattern             | N/A        | Code Review   |
| AD-05  | No dynamic SQL strings           | Repository  | Code review / SonarQube           | N/A        | Code Review   |

---

## 7. Scalability & Performance Guardrails

### 7.1 Logging Standards

**Log Levels**
- **ERROR**: Unrecoverable failures, system errors
- **WARN**: Degraded functionality, business rule violations, authorization failures
- **INFO**: Key business events (create, submit, approve, unlock)
- **DEBUG**: Detailed flow information (development/troubleshooting only)

**What to Log**
- All state changes (with before/after values)
- Authorization checks (both pass and fail)
- Lock acquisition and release
- Validation failures (with error codes)
- External API calls (with timing)

**What NOT to Log**
- Passwords or credentials
- Credit card numbers
- SSN or other PII
- Full entity objects (log IDs only)

### 7.2 Performance Guidelines

**Database Access**
- Use pagination for **all** list queries (default 25, max 200)
- Prefer lazy loading over eager
- Add indexes on foreign keys and filter fields
- Max query execution time: **5 seconds**

**Caching Strategy**
- Cache static reference data (24 hours)
- Cache user permissions (1 hour)
- **Never** cache transactional data

**Configuration**
```yaml
ale:
  pagination:
    default-size: 25
    max-size: 200
  locking:
    timeout-minutes: 30
    max-locks-per-user: 5
  calculation:
    precision: 2
  security:
    jwt-expiration-hours: 8
    rate-limit-per-hour: 1000
```

---

## 8. Implementation Checklist

### Phase 1: Common Infrastructure (2-3 days)
- [ ] Pagination framework
- [ ] Security/Authorization framework
- [ ] Audit trail framework
- [ ] Locking framework
- [ ] Exception handling
- [ ] Logging (MDC, correlation IDs)

### Phase 2: Document Tracker (3-4 days)
- [ ] Domain entities
- [ ] Service implementation
- [ ] Validators
- [ ] DTOs and mappers
- [ ] Controller
- [ ] Tests

### Phase 3: Capital Call (5-7 days)
- [ ] Domain entities
- [ ] Validators (percentage, workflow)
- [ ] Service with locking
- [ ] DTOs and mappers
- [ ] Controller
- [ ] Tests

### Phase 4: Alternative Data (3-4 days)
- [ ] Domain entities
- [ ] Column preference validator
- [ ] Advanced search (Specification)
- [ ] Service implementation
- [ ] Controller
- [ ] Tests

---

## 9. Code Review Checklist

After Copilot generates code, verify:

### Architecture
- [ ] Business logic **only** in service layer
- [ ] Controllers **thin** (request/response only)
- [ ] Repositories **free** of business logic
- [ ] DTOs used (entities never exposed)

### Security
- [ ] Authorization checks before state changes
- [ ] Permissions checked in service layer
- [ ] Sensitive data masked in logs

### Validation
- [ ] Validation rules from matrix implemented
- [ ] Error codes included in exceptions
- [ ] Error messages user-friendly

### Testing
- [ ] Code coverage ≥ 80%
- [ ] All validation rules tested
- [ ] Authorization checks tested
- [ ] State transitions tested

---

## 10. Success Criteria

✅ All modules follow layered architecture  
✅ Test coverage ≥ 80%  
✅ All validation rules implemented  
✅ Authorization enforced on all operations  
✅ API response time < 500ms (95th percentile)  
✅ Code is maintainable and well-documented  

---

**This document serves as the single source of truth for all development activities using GitHub Copilot or other GenAI tools.**