"use client";
import { PageMetadata } from "@/components/header/page-metadata";
import {
  BlockedPage,
  BlockTextElement,
  Block,
} from "@/components/common-page/block";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <BlockedPage>
      <PageMetadata
        title={`${user.first_name} ${user.last_name}`}
        breadcrumbs={[{ label: "Профиль", href: "/profile" }]}
      />
      <Block title="Профиль">
        <BlockTextElement label="Фамилия" value={user?.last_name} />
        <BlockTextElement label="Имя" value={user?.first_name} />
        <BlockTextElement
          label="Отчество"
          value={user.middle_name ? user.middle_name : "[Отсутствует]"}
        />
        <BlockTextElement label="Email" value={user?.email} />
      </Block>
    </BlockedPage>
  );
}
