//submit confirmation with warning
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  
} from "../../../components/ui/Dialog";
import Button from "../../../components/ui/Button";
interface SubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
const SubmitDialog: React.FC<SubmitDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader title="Confirm Submission">
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit this capital call? This action
            cannot be undone.{" "}
          </DialogDescription>{" "}
        </DialogHeader>{" "}
        <DialogFooter>
          {" "}
          <Button variant="outline" onClick={onClose}>
            {" "}
            Cancel{" "}
          </Button>{" "}
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="ml-2"
          >
            {" "}
            Submit{" "}
          </Button>{" "}
        </DialogFooter>{" "}
      </DialogContent>{" "}
    </Dialog>
  );
};
export default SubmitDialog;
