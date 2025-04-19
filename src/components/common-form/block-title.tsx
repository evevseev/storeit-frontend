import { cn } from "@/lib/utils";

interface BlockTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export function BlockTitle({ title, description, className }: BlockTitleProps) {
  return (
    <div className={cn("space-y-1.5 pt-3", className)}>
      <h3 className="text-md font-medium leading-6">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
