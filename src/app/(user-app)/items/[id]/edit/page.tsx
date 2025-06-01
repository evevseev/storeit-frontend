"use client";
import { FormBlock, useAppForm } from "@/components/common-form";
import { PageMetadata } from "@/components/header/page-metadata";
import { itemSchema } from "@/lib/zod/schemas";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useParams, useRouter } from "next/navigation";
import { Block, BlockedPage } from "@/components/common-page/block";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function ItemEditPage() {
  const { id } = useParams() as { id: string };
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const router = useRouter();
  const { data: item, isPending } = client.useQuery("get", "/items/{id}", {
    params: {
      path: {
        id: id,
      },
    },
  });

  const { mutate: updateItem } = client.useMutation("put", "/items/{id}");

  const form = useAppForm({
    defaultValues: {
      name: item?.data.name ?? "",
      description: item?.data.description ?? "",
    } as {
      name: string;
      description: string | null;
    },
    validators: {
      onChange: itemSchema,
    },
    onSubmit: (data) => {
      updateItem(
        {
          params: {
            path: { id },
          },
          body: {
            name: data.value.name,
            description: data.value.description,
          },
        },
        {
          onSuccess: () => {
            toast.success("Товар успешно обновлен");
            globalClient.invalidateQueries({
              queryKey: ["get", "/items/{id}", { params: { path: { id } } }],
            });
            router.push(`/items/${id}`);
          },
          onError: (error) => {
            toast.error("Не удалось обновить товар", {
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
        title="Редактирование товара"
        breadcrumbs={[
          { label: "Товары", href: "/items" },
          { label: item?.data.name ?? "", href: `/items/${id}` },
          { label: "Редактирование" },
        ]}
      />
      <Block title="Редактирование товара" isLoading={isPending}>
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
              children={(field) => <field.TextField label="Название" />}
            />
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextField label="Описание" type="nullabletext" />
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
