package com.company.ale.capitalcall.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Capital Call entity
 * Represents a capital call request with breakdowns
 */
@Entity
@Table(name = "capital_call")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    @Enumerated(EnumType.STRING)
    @Column(name = "queue", nullable = false)
    private CapitalCallQueue queue;

    @Column(name = "locked_by")
    private String lockedBy;
    
    @Column(name = "locked_at")
    private LocalDateTime lockedAt;
    
    @Column(name = "client_name")
    private String clientName;
    
    @Column(name = "asset_description")
    private String assetDescription;
    
    @Column(name = "is_sensitive")
    private Boolean isSensitive;
    
    @Column(name = "toe_reference")
    private String toeReference;
    
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
    
    /**
     * Helper method to add a breakdown
     */
    public void addBreakdown(CapitalCallBreakdown breakdown) {
        breakdowns.add(breakdown);
        breakdown.setCapitalCall(this);
    }
    
    /**
     * Helper method to remove a breakdown
     */
    public void removeBreakdown(CapitalCallBreakdown breakdown) {
        breakdowns.remove(breakdown);
        breakdown.setCapitalCall(null);
    }
}
