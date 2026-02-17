/**
 * generate code for capitalcall count response following the backend specs
 * "counts": {
    "SSI_VERIFICATION": 12,
    "APPROVAL": 5,
    "COMPLETED": 42
  }
    public enum CapitalCallQueue {
    SSI_VERIFICATION,
    REVIEW,
    APPROVAL,
    COMPLETED,
    REJECTED
} 
    where to keep this enum? in the same package as the dto or in a separate package? if separate, what should be the package name?
    CapitalCallQueue enum should be placed in a separate package to maintain a clean architecture and separation of concerns. A suitable package name could be com.company.ale.capitalcall.domain or com.company.ale.capitalcall.enums, depending on the existing structure of the project. This way, the enum can be easily reused across different parts of the application without creating unnecessary dependencies on the DTO package.
    */
package com.company.ale.capitalcall.dto;
import lombok.Builder;
import lombok.Value;
import java.util.Map;
/**
 * DTO for capital call counts by workflow status
 */
@Value
@Builder
public class CapitalCallCountResponse {
    Map<String, Long> counts;
}



