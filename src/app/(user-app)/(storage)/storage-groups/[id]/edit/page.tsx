"use client";
import { Block, BlockedPage } from "@/components/common-page/block";
import { useParams } from "next/navigation";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useQueryClient } from "@tanstack/react-query";
import { PageMetadata } from "@/components/header/page-metadata";
import { FormBlock, useAppForm } from "@/components/common-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { storageGroupSchema } from "@/lib/zod/schemas";

export default function StorageGroupEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const { data: storageGroup, isPending } = client.useQuery(
    "get",
    "/storage-groups/{id}",
    {
      params: {
        path: { id: id as string },
      },
    }
  );

  if (!storageGroup && !isPending) {
    return <div>Группа хранения не найдена</div>;
  }

  const mutation = client.useMutation("put", "/storage-groups/{id}");

  const form = useAppForm({
    defaultValues: {
      name: storageGroup?.data.name ?? "",
      alias: storageGroup?.data.alias ?? "",
    },
    validators: {
      onChange: storageGroupSchema,
    },
    onSubmit: async (data) => {
      mutation.mutate(
        {
          params: {
            path: { id: id as string },
          },
          body: {
            name: data.value.name,
            alias: data.value.alias,
            unitId: storageGroup!.data.unitId,
          },
        },
        {
          onSuccess: () => {
            globalClient.invalidateQueries({
              queryKey: ["get", "/storage-groups/{id}"],
            });
            globalClient.invalidateQueries({
              queryKey: ["get", "/storage-groups"],
            });
            toast.success("Группа хранения успешно обновлена");
            router.push(`/storage-groups/${id}`);
          },
          onError: () => {
            toast.error("Ошибка при обновлении группы хранения");
          },
        }
      );
    },
  });

  return (
    <BlockedPage>
      <PageMetadata
        title={storageGroup?.data.name ?? "Группа хранения"}
        breadcrumbs={[
          {
            label: "Хранение",
            href: "/storage",
          },
          {
            label: "Группы хранения",
          },
          {
            label: storageGroup?.data.name ?? "Группа хранения",
          },
          {
            label: "Редактирование",
          },
        ]}
      />

      <Block title="Основная информация" isLoading={isPending}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FormBlock>
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Название"
                  value={storageGroup!.data.name}
                />
              )}
            />
            <form.AppField
              name="alias"
              children={(field) => (
                <field.TextField
                  label="Обозначение"
                  value={storageGroup!.data.alias}
                />
              )}
            />
            <form.AppForm>
              <form.SubmitButton label="Сохранить" />
            </form.AppForm>
          </FormBlock>
        </form>
      </Block>
    </BlockedPage>
  );
}
