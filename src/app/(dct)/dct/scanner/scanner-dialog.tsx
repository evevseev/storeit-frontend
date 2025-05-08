"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Scanner, ScannerResult } from "./scanner";

interface ScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (result: ScannerResult) => void;
}

export function ScannerDialog({
  open,
  onOpenChange,
  onScan,
}: ScannerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Сканнер</DialogTitle>
        </DialogHeader>
        <Scanner
          onScan={(result) => {
            onScan(result);
            onOpenChange(false);
          }}
          validateUrl={false}
        />
      </DialogContent>
    </Dialog>
  );
} 