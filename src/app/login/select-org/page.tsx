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
import {
  activeOrganizationIdAtom,
  useApiQueryClient,
} from "@/hooks/use-api-query-client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function OrganizationSelect({
  className,
}: React.ComponentProps<"div">) {
  const client = useApiQueryClient();
  const { data, isPending, error } = client.useQuery("get", "/orgs");

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center text-red-500">
          Произошла ошибка при загрузке организаций
        </div>
      );
    }

    if (isPending) {
      return Array.from({ length: 1 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="flex items-center gap-6 p-3 w-full border-2 rounded-lg"
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        </div>
      ));
    }

    return data?.data.map((org) => (
      <OrganizationSelector
        key={org.id}
        id={org.id}
        name={org.name}
        subdomain={org.subdomain}
      />
    ));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Выберите организацию</CardTitle>
          <CardDescription>Или создайте новую</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {renderContent()}
            <CreateOrgDialog />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <ChangeAccountButton />
      </div>
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
  const setActiveOrgId = useSetAtom(activeOrganizationIdAtom);

  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_APP_URL}`}
      className="rounded-lg border-black border-2 shadow-sm hover:shadow-md transition-colors"
      onClick={() => {
        setActiveOrgId(id);
      }}
    >
      <div className="flex items-center gap-6 p-3 w-full">
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

export function ChangeAccountButton() {
  const { logout, isLoading } = useAuth();

  return (
    <Button 
      variant="outline" 
      className="gap-2" 
      onClick={logout}
      disabled={isLoading}
    >
      <LogOut className="h-4 w-4" />
      Сменить аккаунт
    </Button>
  );
}
