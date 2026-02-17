package com.company.ale.alternativedata.repository;

import com.company.ale.alternativedata.domain.AlternativeData;
import com.company.ale.alternativedata.domain.DataStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository for AlternativeData entity
 */
@Repository
public interface AlternativeDataRepository extends JpaRepository<AlternativeData, Long>, JpaSpecificationExecutor<AlternativeData> {
    
    List<AlternativeData> findByClientNameAndAccountNumber(String clientName, String accountNumber);
    
    List<AlternativeData> findByStatusAndReportDate(DataStatus status, LocalDate reportDate);
    
    List<AlternativeData> findByDataSource(String dataSource);
}
