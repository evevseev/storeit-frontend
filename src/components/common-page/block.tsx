import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Edit, Pencil, Trash2 } from "lucide-react";

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
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3">{children}</div>
      </CardContent>
    </Card>
  );
}
