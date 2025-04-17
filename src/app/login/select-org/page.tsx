"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import CreateOrgDialog from "@/components/create-org/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import client from "@/lib/api/client";

export default function OrganizationSelect({
  className,
}: React.ComponentProps<"div">) {
  const { data, isLoading, error } = client.useQuery("get", "/orgs");
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Выберите организацию</CardTitle>
          <CardDescription>Или создайте новую</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {!isLoading &&
              !error &&
              data?.data.map((org) => (
                <OrganizationSelector
                  id={org.id}
                  name={org.name}
                  subdomain={org.subdomain}
                />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function OrganizationSelector({
  id,
  name,
  subdomain,
}: {
  id: string;
  name: string;
  subdomain: string;
}) {
  return (
    <Link
      href={`https://${subdomain}.${process.env.NEXT_PUBLIC_APP_URL}`}
      className="rounded-lg border-red-500 border-2 shadow-sm hover:shadow-md transition-colors"
    >
      <div className="flex items-center gap-6 p-5 w-full">
        <Avatar className="w-10 h-10">
          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{subdomain}</div>
        </div>
      </div>
    </Link>
  );
}
