//approval confirmation
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
interface ApprovalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}
const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader title="Confirm Approval">
                    <DialogTitle>Confirm Approval</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to approve this capital call? This action
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
                        Approve{" "}
                    </Button>{" "}
                </DialogFooter>{" "}
            </DialogContent>{" "}
        </Dialog>
    );
};
export default ApprovalDialog;