package com.company.ale.alternativedata.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Alternative Data entity
 * Represents a record of alternative investment data
 */
@Entity
@Table(name = "alternative_data", indexes = {
    @Index(name = "idx_client_account", columnList = "client_name,account_number"),
    @Index(name = "idx_report_date", columnList = "report_date"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlternativeData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "client_name", nullable = false)
    private String clientName;
    
    @Column(name = "account_number", nullable = false)
    private String accountNumber;
    
    @Column(name = "fund_family")
    private String fundFamily;
    
    @Column(name = "asset_description")
    private String assetDescription;
    
    @Column(name = "data_source", nullable = false)
    private String dataSource;
    
    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DataStatus status;
    
    // Additional data fields
    @Column
    private String navValue;
    
    @Column
    private String commitmentAmount;
    
    @Column(length = 2000)
    private String dataAttributes;
    
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
