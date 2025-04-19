import { Printer } from "lucide-react";
import { Button } from "../ui/button";
import { usePrintLabels, Label } from "@/hooks/use-print-labels";

export function PrintLabelButton({ labels = [] }: { labels: Label[] }) {
  const { printLabels } = usePrintLabels();
  return (
    <Button
      onClick={() => printLabels(labels)}
      variant="outline"
      className="h-8 w-8"
    >
      <Printer className="w-4 h-4" />
    </Button>
  );
}
