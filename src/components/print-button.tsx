import { Button } from "@/components/ui/button";
import { Label, usePrintLabels } from "@/hooks/use-print-labels";
import { Printer } from "lucide-react";

export default function PrintButton({ label }: { label: Label }) {
  const { printLabels } = usePrintLabels();
  return (
    <Button variant="outline" onClick={() => printLabels([label])}>
      <Printer />
      Печать этикетки
    </Button>
  );
}
