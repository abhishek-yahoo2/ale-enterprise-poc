# Capital Call Workflow Actions Implementation

## Overview
Complete implementation of workflow actions for Capital Call management in the frontend, including create/update hooks and UI components for state transitions.

## Implemented Components

### 1. **Workflow Hooks** (`useCapitalCallWorkflow.ts`)
The dedicated hooks file provides four main mutations for workflow operations:

- **`useSubmitCapitalCall()`** - Submit capital call from DRAFT → SUBMITTED
  - Requires: `RULE_SUBMIT` permission
  - Invalidates queries and shows success toast
  - State transition: DRAFT → SUBMITTED, locks released

- **`useApproveCapitalCall()`** - Approve capital call from SUBMITTED → APPROVED
  - Requires: `RULE_APPROVE` permission
  - Updates query cache with latest data
  - State transition: SUBMITTED → APPROVED

- **`useRejectCapitalCall()`** - Reject capital call from SUBMITTED → DRAFT
  - Requires: `RULE_APPROVE` permission (approvers can reject)
  - Returns item to draft status for edits
  - Re-acquires lock for the creator
  - State transition: SUBMITTED → DRAFT

- **`useUnlockCapitalCall()`** - Force unlock a capital call (admin operation)
  - Requires: `RULE_UNLOCK_WORK_ITEM` permission
  - Used by administrators to unlock locked capital calls
  - Clears lock owner and lock timestamp

- **`useCapitalCallWorkflow()`** - Combined hook
  - Returns all four mutations plus combined loading state
  - Convenient for components needing multiple workflow actions

### 2. **Workflow Actions Component** (`CapitalCallWorkflowActions.tsx`)
React component that displays context-sensitive action buttons based on current workflow status:

```tsx
<CapitalCallWorkflowActions
  capitalCall={capitalCallData}
  userPermissions={userPermissions}
  onActionComplete={(updatedData) => {
    // Handle successful action completion
  }}
/>
```

**Features:**
- **DRAFT Status**: Shows "Submit for Approval" button
- **SUBMITTED Status**: Shows "Approve" and "Reject" buttons (if user has RULE_APPROVE)
- **REJECTED Status**: Shows "Submit Again" button
- **Locked Items**: Shows "Force Unlock" button (if user has RULE_UNLOCK_WORK_ITEM)
- **Confirmation Dialogs**: Asks for user confirmation before state transitions
- **Loading States**: Shows loading indicators during API calls
- **Status Badge**: Displays current workflow status with color coding

### 3. **Lock Status Component** (`CapitalCallLockStatus.tsx`)
Displays lock information and ownership:

```tsx
<CapitalCallLockStatus 
  capitalCall={capitalCallData}
  currentUser={currentUsername}
/>
```

**Features:**
- Shows lock status (locked/unlocked)
- Displays lock owner name
- Shows when the lock was acquired (relative time: "5m ago", "2h ago", etc.)
- Visual distinction between self-lock and external lock
- Green indicator for unlocked state, blue/orange for locked states

### 4. **API Client Updates** (`capitalCallApi.ts`)
Cleaned up API client with the following workflow endpoints:

- `submit(id)` - POST `/api/capital-call/{id}/submit`
- `approve(id)` - POST `/api/capital-call/{id}/approve`
- `reject(id)` - POST `/api/capital-call/{id}/reject`
- `unlock(id)` - POST `/api/capital-call/{id}/unlock`

Removed deprecated lock/unlock placeholder methods (the implementation now uses proper workflow actions).

## Integration Example

```tsx
import { useCapitalCallDetails } from '../hooks/useCapitalCallSearch';
import { useCapitalCallWorkflow } from '../hooks/useCapitalCallWorkflow';
import { CapitalCallWorkflowActions } from '../components/CapitalCallWorkflowActions';
import { CapitalCallLockStatus } from '../components/CapitalCallLockStatus';

function MyCapitalCallPage() {
  const { data: capitalCall } = useCapitalCallDetails(id);
  const userPermissions = ['RULE_SUBMIT', 'RULE_APPROVE', 'RULE_UNLOCK_WORK_ITEM'];
  const currentUser = 'john.doe'; // From auth context

  return (
    <div>
      {/* Lock Status Info */}
      <CapitalCallLockStatus 
        capitalCall={capitalCall}
        currentUser={currentUser}
      />

      {/* Workflow Action Buttons */}
      <CapitalCallWorkflowActions
        capitalCall={capitalCall}
        userPermissions={userPermissions}
        onActionComplete={(updatedCC) => {
          // Refresh page or update state
        }}
      />
    </div>
  );
}
```

## Workflow State Diagram

```
        ┌─────────────────────────────────┐
        │     DRAFT (Initial State)       │
        │  - User has edit permissions    │
        │  - Can add/edit breakdowns      │
        └─────────────┬─────────────────┘
                      │
                      │ Submit
                      ▼
        ┌─────────────────────────────────┐
        │   SUBMITTED (For Approval)      │
        │  - User cannot edit             │
        │  - Lock released                │
        │  - Awaiting approver decision   │
        └───────┬──────────────────┬──────┘
                │                  │
         Approve│                  │Reject
                │                  │
                ▼                  ▼
        ┌──────────────────┐  ┌──────────────────┐
        │   APPROVED       │  │  DRAFT (Revised) │
        │ - Final state    │  │  - Returned to   │
        │ - Cannot edit    │  │    draft, relocked
        └──────────────────┘  └──────────────────┘
```

## Authorization Rules

| Action   | Required Permission | From Status | To Status |
|----------|-------------------|-------------|-----------|
| Submit   | RULE_SUBMIT       | DRAFT       | SUBMITTED |
| Approve  | RULE_APPROVE      | SUBMITTED   | APPROVED  |
| Reject   | RULE_APPROVE      | SUBMITTED   | DRAFT     |
| Unlock   | RULE_UNLOCK_WORK_ITEM | Any     | (same, removes lock) |

## Error Handling

All hooks include automatic error handling:
- HTTP errors are caught and displayed as toast notifications
- Backend validation errors are extracted from response and shown to user
- Query cache is invalidated on success to ensure fresh data
- Failed operations maintain current state without side effects

## Testing the Implementation

1. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

2. **Ensure backend is running:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Test workflow transitions:**
   - Create a capital call (status = DRAFT)
   - Click "Submit for Approval" → status changes to SUBMITTED
   - Click "Approve" → status changes to APPROVED
   - Or "Reject" → status returns to DRAFT

4. **Verify lock behavior:**
   - When submitting, lock is released
   - When rejecting, lock is re-acquired by rejector
   - Lock status component shows ownership and timing

## Files Modified/Created

### New Files:
- `src/features/capital-call/hooks/useCapitalCallWorkflow.ts`
- `src/features/capital-call/components/CapitalCallWorkflowActions.tsx`
- `src/features/capital-call/components/CapitalCallLockStatus.tsx`

### Modified Files:
- `src/features/capital-call/api/capitalCallApi.ts` - Cleaned up API methods
- `tsconfig.app.json` - Fixed TypeScript path aliases and strict modes
- `src/components/ui/Button.tsx` - Updated to use clsx instead of classnames
- `src/types/api.ts` - WorkflowStatus enum already properly defined
- Various hook files - Fixed type imports and unused parameter warnings

## Dependencies

All required dependencies are already installed:
- `@tanstack/react-query` - For mutation management
- `sonner` - For toast notifications
- `lucide-react` - For icons (optional, using emoji fallback)
- `date-fns` - For date formatting
- `clsx` - For CSS class composition

## Next Steps

1. Integrate workflow components into Capital Call details page
2. Add workflow action logging/audit trail
3. Implement comment functionality for rejections
4. Add workflow history timeline view
5. Create approval workflow notifications (email/in-app)
