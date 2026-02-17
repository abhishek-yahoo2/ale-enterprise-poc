package com.company.ale.documenttracker.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Document Tracker entity
// Table: document_tracker
// Fields: id, genId (unique, pattern GEN\d{8}), documentType, receivedAt
// One-to-Many relationship with SubDocument
// Audit fields: createdAt, createdBy, modifiedAt, modifiedBy
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "document_tracker")
@Data
@Builder
public class DocumentTracker {
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // GenId must be unique and match pattern GEN followed by 8 digits
    @Column(nullable = false, unique = true)
    @Pattern(regexp = "GEN\\d{8}", message = "GenId must match pattern GEN followed by 8 digits")
    private String genId;

    @Column(name = "document_name")
    private String documentName;
    
    @Column(name = "document_date")
    private java.time.LocalDate documentDate;
    
    @Column(name = "document_type")
    private String documentType;
    
    @Column(name = "client_name")
    private String clientName;
    
    @Column(name = "ale_gen_id")
    private String aleGenId;
    
    @Column(name = "account_number")
    private String accountNumber;
    
    @Column(name = "security_number")
    private String securityNumber;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "current_location")
    private String currentLocation;
    
    @Column(name = "business_unit")
    private String businessUnit;
    
    @Column(name = "link")
    private String link;
    
    @Column(name = "received_at")
    private LocalDateTime receivedAt;
    
    @OneToMany(mappedBy = "documentTracker", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubDocument> subDocuments = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;
    
    @Column(name = "modified_by")
    private String modifiedBy;
    // Helper method to add SubDocument
    public void addSubDocument(SubDocument subDocument) {
        subDocuments.add(subDocument);
        subDocument.setDocumentTracker(this);
    }
    // Helper method to remove SubDocument
    public void removeSubDocument(SubDocument subDocument) {
        subDocuments.remove(subDocument);
        subDocument.setDocumentTracker(null);
    }
}
