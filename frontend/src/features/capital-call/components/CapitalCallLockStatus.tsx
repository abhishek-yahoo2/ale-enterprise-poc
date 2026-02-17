import React from 'react';
import type { CapitalCallDetails } from '@/types/api';

interface CapitalCallLockStatusProps {
  capitalCall: CapitalCallDetails;
  currentUser?: string;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export const CapitalCallLockStatus: React.FC<CapitalCallLockStatusProps> = ({
  capitalCall,
  currentUser,
}) => {
  if (!capitalCall.lockedBy) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <span>🔓</span>
        <span>Not locked - Available for editing</span>
      </div>
    );
  }

  const isLockedByCurrentUser = currentUser === capitalCall.lockedBy;
  const lockTime = capitalCall.lockedAt ? new Date(capitalCall.lockedAt) : null;

  return (
    <div
      className={`flex items-center gap-2 text-sm ${isLockedByCurrentUser ? 'text-blue-600' : 'text-orange-600'}`}
    >
      <span>🔒</span>
      <span>
        {isLockedByCurrentUser ? 'Locked by you' : `Locked by ${capitalCall.lockedBy}`}
        {lockTime && ` ${formatTimeAgo(lockTime)}`}
      </span>
    </div>
  );
};
