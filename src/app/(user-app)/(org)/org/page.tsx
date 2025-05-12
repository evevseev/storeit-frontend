"use client";

import { PageMetadata } from "@/components/header/page-metadata";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import {
  Block,
  BlockedPage,
  BlockTextElement,
} from "@/components/common-page/block";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { DeleteDialog } from "@/components/dialogs/deletion";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { HistoryTable } from "@/components/common-page/history-table";
import { ObjectType } from "@/components/common-page/history-table/types";

export default function OrgPage() {
  const client = useApiQueryClient();
  const { logout, getOrganizationId } = useAuth();
  const { mutate: deleteMutation } = client.useMutation("delete", "/orgs/{id}");
  const queryClient = useQueryClient();

  const { data: org, isPending } = client.useQuery("get", "/orgs/{id}", {
    params: {
      path: {
        id: getOrganizationId(),
      },
    },
  });

  function handleDelete() {
    deleteMutation(
      {
        params: {
          path: {
            id: getOrganizationId(),
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Организация удалена");
          logout();
          queryClient.invalidateQueries({ queryKey: ["get", "/orgs"] });
        },
        onError: (error) => {
          toast.error("Ошибка при удалении организации", {
            description: error.error.message,
          });
        },
      }
    );
  }
  return (
    <>
      <PageMetadata
        title={`${org?.data.name}`}
        breadcrumbs={[
          { label: "Организация" },
          { label: org?.data.name ?? "" },
        ]}
        actions={[
          <DeleteDialog
            firstText={`Вы действительно желаете удалить организацию ${org?.data.name}?`}
            buttonLabel="Удалить организацию"
            onDelete={handleDelete}
          />,
          <Link
            href="/org/edit"
            className={buttonVariants({ variant: "outline" })}
          >
            <Pencil />
            Редактировать
          </Link>,
        ]}
      />
      <BlockedPage>
        <Block title="Информация о организации" isLoading={isPending}>
          <BlockTextElement label="Название" value={org?.data.name} />
          <BlockTextElement label="Поддомен" value={org?.data.subdomain} />
        </Block>
        <HistoryTable
          objectType={ObjectType.Organization}
          objectId={getOrganizationId()}
        />
      </BlockedPage>
    </>
  );
}
