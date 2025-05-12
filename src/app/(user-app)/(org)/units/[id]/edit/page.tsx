"use client";

import { PageMetadata } from "@/components/header/page-metadata";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useAppForm } from "@/components/common-form";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Block, BlockedPage } from "@/components/common-page/block";
import { unitSchema } from "@/lib/zod/schemas";

export default function EditUnitPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const client = useApiQueryClient();
  const globalQueryClient = useQueryClient();

  const { data: unitData, isPending } = client.useQuery("get", "/units/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  const mutation = client.useMutation("put", "/units/{id}");

  const form = useAppForm({
    defaultValues: {
      name: unitData?.data.name ?? "",
      alias: unitData?.data.alias ?? "",
      address: unitData?.data.address ?? "",
    },
    validators: {
      onChange: unitSchema,
    },
    onSubmit: (data) => {
      mutation.mutate(
        {
          params: {
            path: {
              id,
            },
          },
          body: {
            name: data.value.name,
            alias: data.value.alias,
            address: data.value.address,
          },
        },
        {
          onSuccess: () => {
            globalQueryClient.invalidateQueries({ queryKey: ["units"] });
            toast.success("Подразделение успешно обновлено");
            router.push(`/units/${id}`);
          },
          onError: (error) => {
            toast.error("Ошибка при обновлении подразделения", {
              description: JSON.stringify(error),
            });
          },
        }
      );
    },
  });

  if (isPending) {
    return null;
  }

  return (
    <>
      <BlockedPage>
        <PageMetadata
          title="Редактирование подразделения"
          breadcrumbs={[
            { label: "Организация" },
            { label: "Подразделения", href: "/units" },
            { label: "Редактирование" },
          ]}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Block title="Редактирование подразделения">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Название подразделения"
                  placeholder="Москва"
                />
              )}
            />
            <form.AppField
              name="address"
              children={(field) => (
                <field.TextField
                  label="Адрес подразделения"
                  placeholder="Москва, ул. Ленина, 1"
                />
              )}
            />
            <form.AppField
              name="alias"
              children={(field) => (
                <field.TextField
                  label="Аббревиатура подразделения"
                  placeholder="MSK1"
                />
              )}
            />
            <form.AppForm>
              <form.SubmitButton label="Сохранить" />
            </form.AppForm>
          </Block>
        </form>
      </BlockedPage>
    </>
  );
}
