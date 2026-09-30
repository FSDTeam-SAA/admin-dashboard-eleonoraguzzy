"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmDeleteDialogProps = {
  itemName: string | null;
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDeleteDialog({ itemName, pending, onConfirm, onCancel }: ConfirmDeleteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (itemName && !dialog.open) dialog.showModal();
    if (!itemName && dialog.open) dialog.close();
  }, [itemName]);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-delete-dialog"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
      onCancel={(event) => {
        if (pending) event.preventDefault();
      }}
      onClose={onCancel}
    >
      <div className="confirm-delete-icon"><AlertTriangle size={25} /></div>
      <h2 id="confirm-delete-title">Delete {itemName || "item"}?</h2>
      <p id="confirm-delete-description">This action cannot be undone. Are you sure you want to delete it?</p>
      <div className="confirm-delete-actions">
        <Button type="button" variant="outline" disabled={pending} onClick={onCancel}>No</Button>
        <Button type="button" variant="danger" disabled={pending} onClick={onConfirm}>{pending ? "Deleting..." : "Yes"}</Button>
      </div>
    </dialog>
  );
}
