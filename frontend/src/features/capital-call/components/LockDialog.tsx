/**
 * COPILOT: Lock dialog component - simplified without Alert component
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import Button  from '@/components/ui/Button';
import { Lock, AlertCircle } from 'lucide-react';
import { useUnlockCapitalCall } from '../hooks/useCapitalCallWorkflow';
import type { CapitalCall } from '../types';

interface LockDialogProps {
  open: boolean;
  onClose: () => void;
  capitalCall: CapitalCall | null;
}

export const LockDialog: React.FC<LockDialogProps> = ({
  open,
  onClose,
  capitalCall
}) => {
  const unlockMutation = useUnlockCapitalCall();
  
  // Check if user has unlock permission
  const canForceUnlock = false; // TODO: Replace with actual permission check
  
  const handleForceUnlock = async () => {
    if (!capitalCall) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to force unlock this item? This will kick out ${capitalCall.lockedBy}.`
    );
    
    if (confirmed) {
      unlockMutation.mutate(capitalCall.id, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };
  
  if (!capitalCall) return null;
  
  return (
    <Dialog isOpen={open} onClose={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader title="Locked by Another User">
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600" />
            Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Simple alert-style div instead of Alert component */}
          <div className="flex gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                Locked by {capitalCall.lockedBy}
              </p>
              {capitalCall.lockedAt && (
                <p className="text-sm text-gray-600 mt-1">
                  Since: {new Date(capitalCall.lockedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            This capital call is currently being edited by another user. 
            Please try again later or contact the user to release the lock.
          </p>
          
          {canForceUnlock && (
            <p className="text-sm text-amber-600 mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
              As an administrator, you can force unlock this item. 
              This will immediately end the other user's session.
            </p>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          {canForceUnlock && (
            <Button
              variant="danger"
              onClick={handleForceUnlock}
              disabled={unlockMutation.isPending}
            >
              {unlockMutation.isPending ? 'Unlocking...' : 'Force Unlock'}
            </Button>
          )}
          
          <Button 
            onClick={onClose}
            className="bg-teal-600 hover:bg-teal-700"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};