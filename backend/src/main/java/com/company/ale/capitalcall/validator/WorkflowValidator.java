package com.company.ale.capitalcall.validator;

import com.company.ale.capitalcall.domain.WorkflowStatus;
import com.company.ale.common.exception.ValidationException;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

/**
 * COPILOT PROMPT - Workflow Validator
 * 
 * PURPOSE: Validate workflow status transitions for Capital Call
 * 
 * VALIDATION METHOD:
 * - validateTransition(WorkflowStatus from, WorkflowStatus to)
 *   Rule CC-07: Validate status transitions
 *   Error: BUS_001 if invalid transition
 * 
 * VALID TRANSITIONS MAP:
 * - DRAFT -> [DRAFT, SUBMITTED]
 * - SUBMITTED -> [APPROVED, REJECTED, DRAFT]
 * - REJECTED -> [DRAFT]
 * - APPROVED -> [] (no transitions, terminal state)
 * 
 * IMPLEMENTATION:
 * - Create static Map of valid transitions
 * - Check if target status is in allowed set
 * - Throw ValidationException with clear message if invalid
 */

@Component
public class WorkflowValidator {
    
    // Map of valid status transitions
    // Key: Current status, Value: Set of allowed next statuses
    private static final Map<WorkflowStatus, Set<WorkflowStatus>> VALID_TRANSITIONS = Map.of(
        WorkflowStatus.DRAFT, Set.of(WorkflowStatus.DRAFT, WorkflowStatus.SUBMITTED),
        WorkflowStatus.SUBMITTED, Set.of(WorkflowStatus.APPROVED, WorkflowStatus.REJECTED, WorkflowStatus.DRAFT),
        WorkflowStatus.REJECTED, Set.of(WorkflowStatus.DRAFT),
        WorkflowStatus.APPROVED, Set.of() // Terminal state - no transitions allowed
    );
    
    /**
     * Validate workflow status transition
     * Rule CC-07: Ensure only valid status transitions occur
     * 
     * @param from Current workflow status
     * @param to Target workflow status
     * @throws ValidationException with error code BUS_001 if transition is invalid
     */
    public void validateTransition(WorkflowStatus from, WorkflowStatus to) {
        // Start typing here - Copilot will suggest the validation logic
        Set<WorkflowStatus> allowedStatuses = VALID_TRANSITIONS.get(from);
        
        if (allowedStatuses == null || !allowedStatuses.contains(to)) {
            throw new ValidationException(
                String.format("Invalid status transition from %s to %s", from, to),
                "BUS_001"
            );
        }
    }
    
    /**
     * Check if transition is valid without throwing exception
     * Useful for UI to show/hide action buttons
     */
    public boolean isTransitionValid(WorkflowStatus from, WorkflowStatus to) {
        Set<WorkflowStatus> allowedStatuses = VALID_TRANSITIONS.get(from);
        return allowedStatuses != null && allowedStatuses.contains(to);
    }
    
    /**
     * Get all valid next statuses for current status
     * Useful for UI to display available actions
     */
    public Set<WorkflowStatus> getAllowedNextStatuses(WorkflowStatus current) {
        return VALID_TRANSITIONS.getOrDefault(current, Set.of());
    }
}