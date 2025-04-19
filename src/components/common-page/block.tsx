import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Edit, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function BlockedPage({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}
export function BlockedPageRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-row gap-6 w-full">{children}</div>;
}

export function BlockRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-row gap-6">{children}</div>;
}
export function BlockTextElement({
  label,
  unitLabel,
  value,
}: {
  label: string;
  unitLabel?: string;
  value?: string;
}) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div>
        {value}
        {unitLabel && (
          <span className="text-muted-foreground"> {unitLabel}</span>
        )}
      </div>
    </div>
  );
}
export function BlockCustomElement({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div>{children}</div>
    </div>
  );
}

export function Block({
  title,
  children,
  isLoading,
}: {
  title?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <Card className="w-full">
      {(title || isLoading) && (
        <CardHeader>
          {isLoading ? (
            <Skeleton className="h-7 w-[200px]" />
          ) : (
            <CardTitle>{title}</CardTitle>
          )}
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">{children}</div>
        )}
      </CardContent>
    </Card>
  );
}
