package com.company.ale.documenttracker.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

// SubDocument entity
// Table: sub_document
// Fields: id, subId (unique), status, statusMessage, processedAt
// Many-to-One relationship with DocumentTracker
// Implements getSeverity() method to map status to severity
// Status is immutable once PROCESS_COMPLETED (use @PreUpdate)
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "sub_document")
@Data
@Builder
public class SubDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Unique SubId
    @Column(nullable = false, unique = true)
    private String subId;
    
    // Many-to-one relationship with DocumentTracker
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gen_id", nullable = false)
    private DocumentTracker documentTracker;
    
    // Status enum
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubIdStatus status;
    
    // Calculate severity from status
    // PROCESS_FAILED -> ERROR
    // PROCESS_COMPLETED -> SUCCESS
    // IN_PROGRESS -> INFO
    public Severity getSeverity() {
        switch (status) {
            case PROCESS_FAILED:
                return Severity.ERROR;
            case PROCESS_COMPLETED:
                return Severity.SUCCESS;
            case IN_PROGRESS:
                return Severity.INFO;
            default:
                return Severity.INFO; // Default to INFO for unknown statuses
        }
    }   
    private String statusMessage;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime modifiedAt;
    private String modifiedBy;
    
    // Ensure status is immutable once PROCESS_COMPLETED
    @PreUpdate
    public void preUpdate() {
        if (this.status == SubIdStatus.PROCESS_COMPLETED) {
            throw new IllegalStateException("Cannot update SubDocument once status is PROCESS_COMPLETED");
        }
    }
}