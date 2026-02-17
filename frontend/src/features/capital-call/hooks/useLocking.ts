//Implement useLocking.ts hook properly
// Lock acquire on edit mode
// Lock release on cancel/save
// Force unlock for admins
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { capitalCallApi } from "../api/capitalCallApi";

export const useLocking = (capitalCallId: string) => {
  const queryClient = useQueryClient();
  const acquireLock = useMutation({
    mutationFn: () => capitalCallApi.acquireLock(capitalCallId),
    onSuccess: () => {
      queryClient.invalidateQueries(["capital-call", capitalCallId]);
    },
  });
  const releaseLock = useMutation({
    mutationFn: () => capitalCallApi.releaseLock(capitalCallId),
    onSuccess: () => {
      queryClient.invalidateQueries(["capital-call", capitalCallId]);
    },
  });
  //force unlock for admins
  const forceUnlock = useMutation({
    mutationFn: () => capitalCallApi.forceUnlock(capitalCallId),
    onSuccess: () => {
      queryClient.invalidateQueries(["capital-call", capitalCallId]);
    },
  });

  return { acquireLock, releaseLock, forceUnlock };
};
