"use client";
import { FormBlock, useAppForm } from "@/components/common-form";
import { Block, BlockedPage } from "@/components/common-page/block";
import { PageMetadata } from "@/components/header/page-metadata";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { cellsGroupSchema } from "@/lib/zod/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CellsGroupEditPage() {
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: group, isLoading } = client.useQuery(
    "get",
    "/cells-groups/{groupId}",
    {
      params: {
        path: { groupId: id },
      },
    }
  );
  const mutation = client.useMutation("put", "/cells-groups/{groupId}");

  const form = useAppForm({
    defaultValues: {
      name: group?.data.name ?? "",
      alias: group?.data.alias ?? "",
    },
    validators: {
      onChange: cellsGroupSchema,
    },
    onSubmit: (data) => {
      mutation.mutate(
        {
          params: {
            path: { groupId: id },
          },
          body: {
            unitId: group?.data.unitId ?? "",
            name: data.value.name,
            alias: data.value.alias,
          },
        },
        {
          onSuccess: () => {
            toast.success("Группа ячеек успешно обновлена");

            globalClient.invalidateQueries({
              queryKey: ["get", "/cells-groups/{groupId}"],
            });
            globalClient.invalidateQueries({
              queryKey: ["get", "/cells-groups"],
            });
            router.push(`/cells-groups/${id}`);
          },
          onError: (error) => {
            toast.error("Ошибка при обновлении группы ячеек", {
              description: error.error.message,
            });
          },
        }
      );
    },
  });

  return (
    <BlockedPage>
      <PageMetadata
        title={group?.data.name ?? "Группа ячеек"}
        breadcrumbs={[
          { label: "Склад", href: "/storage" },
          { label: "Группа ячеек" },
          {
            label: group?.data.name ?? "Группа ячеек",
            href: `/cells-groups/${id}`,
          },
          { label: "Редактирование" },
        ]}
      />
      <Block>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FormBlock>
            <form.AppField name="name">
              {(field) => <field.TextField label="Название" />}
            </form.AppField>
            <form.AppField name="alias">
              {(field) => <field.TextField label="Обозначение" />}
            </form.AppField>
            <form.AppForm>
              <form.SubmitButton label="Сохранить" />
            </form.AppForm>
          </FormBlock>
        </form>
      </Block>
    </BlockedPage>
  );
}
