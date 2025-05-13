import { Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ReactNode } from "react";

interface CopyableTextProps {
  children?: ReactNode;
  className?: string;
}

export function CopyableText({ children, className }: CopyableTextProps) {
  const copyToClipboard = async () => {
    try {
      const textToCopy =
        typeof children === "string" ? children : String(children);
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Текст скопирован в буфер обмена");
    } catch (err) {
      toast.error("Не удалось скопировать текст");
    }
  };

  return (
    <div
      className={cn("flex items-center gap-2 group cursor-pointer", className)}
      onClick={copyToClipboard}
    >
      <span className="border-b border-dotted border-muted-foreground group-hover:border-foreground transition-colors">
        {children}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          copyToClipboard();
        }}
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
}
