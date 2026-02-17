package com.company.ale.alternativedata.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * User Column Preference entity
 * Stores user's column preferences for alternative data views
 */
@Entity
@Table(name = "user_column_preference",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "module_name"}),
       indexes = {
           @Index(name = "idx_user_module", columnList = "user_id,module_name")
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserColumnPreference {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "module_name", nullable = false)
    private String moduleName;
    
    @Column(name = "view_name")
    private String viewName;
    
    @Column(name = "column_names", nullable = false, length = 4000)
    @Convert(converter = StringListConverter.class)
    private List<String> columnNames;
    
    @Column(name = "display_order", length = 4000)
    @Convert(converter = StringListConverter.class)
    private List<String> displayOrder;
    
    @Column(name = "is_default")
    private Boolean isDefault;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Version
    private Integer version;
    
    /**
     * Validate column count before persist/update
     */
    @PrePersist
    @PreUpdate
    public void validateColumnCount() {
        if (columnNames != null && columnNames.size() > 40) {
            throw new IllegalArgumentException("Maximum 40 columns allowed");
        }
    }
}
