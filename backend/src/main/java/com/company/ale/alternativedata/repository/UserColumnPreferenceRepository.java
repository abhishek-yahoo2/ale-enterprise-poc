package com.company.ale.alternativedata.repository;

import com.company.ale.alternativedata.domain.UserColumnPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository for UserColumnPreference entity
 */
@Repository
public interface UserColumnPreferenceRepository extends JpaRepository<UserColumnPreference, Long> {
    
    Optional<UserColumnPreference> findByUserIdAndModuleName(String userId, String moduleName);
    
    Optional<UserColumnPreference> findByUserIdAndModuleNameAndIsDefaultTrue(String userId, String moduleName);
}
