package com.company.ale.alternativedata.dto;

import com.company.ale.alternativedata.domain.DataStatus;
import lombok.Builder;
import lombok.Value;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for alternative data response
 */
@Value
@Builder
public class AlternativeDataResponse {
    Long id;
    String clientName;
    String accountNumber;
    String fundFamily;
    String assetDescription;
    String dataSource;
    LocalDate reportDate;
    DataStatus status;
    String navValue;
    String commitmentAmount;
    LocalDateTime createdAt;
    String createdBy;
    LocalDateTime modifiedAt;
    String modifiedBy;
}
