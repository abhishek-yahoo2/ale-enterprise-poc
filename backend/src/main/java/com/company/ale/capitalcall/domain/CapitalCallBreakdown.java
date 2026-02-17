package com.company.ale.capitalcall.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Capital Call Breakdown entity
 * Represents a breakdown category and its percentage allocation
 */
@Entity
@Table(name = "capital_call_breakdown")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    
    /**
     * Calculate the amount based on total amount and percentage
     * @param totalAmount the total capital call amount
     * @param precision the rounding precision
     */
    public void calculateAmount(BigDecimal totalAmount, int precision) {
        if (totalAmount != null && percentage != null) {
            this.calculatedAmount = totalAmount
                .multiply(percentage)
                .divide(BigDecimal.valueOf(100), precision, RoundingMode.HALF_UP);
        }
    }
}
