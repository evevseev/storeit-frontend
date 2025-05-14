"use client";

import { FormBlock, useAppForm } from "@/components/common-form";
import {
  Block,
  BlockedPage,
  BlockTextElement,
} from "@/components/common-page/block";
import { PageMetadata } from "@/components/header/page-metadata";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { instanceSchema } from "@/lib/zod/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

export default function InstanceEditPage() {
  const { id } = useParams() as { id: string };
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const router = useRouter();
  const { data: instance, isPending: isInstancePending } = client.useQuery(
    "get",
    "/instances/{instanceId}",
    {
      params: {
        path: {
          instanceId: id,
        },
      },
    }
  );

  const { data: item } = client.useQuery(
    "get",
    "/items/{id}",
    {
      params: {
        path: {
          id: instance?.data.item.id ?? "",
        },
      },
    },
    { enabled: !!instance }
  );

  const updateInstanceMutation = client.useMutation(
    "put",
    "/instances/{instanceId}"
  );

  const form = useAppForm({
    defaultValues: {
      variantId: instance?.data.variant.id ?? "testest",
      cellId: instance?.data.cell?.id ?? null,
    } as {
      variantId: string;
      cellId: string | null;
    },
    validators: {
      onChange: instanceSchema,
    },
    onSubmit: (data) => {
      updateInstanceMutation.mutate(
        {
          params: {
            path: { instanceId: id },
          },
          body: {
            variantId: data.value.variantId,
            cellId: data.value.cellId,
          },
        },
        {
          onSuccess: () => {
            toast.success("Экземпляр успешно обновлен");
            globalClient.invalidateQueries();
            router.push(`/instances/${id}`);
          },
          onError: (error) => {
            toast.error("Ошибка при обновлении экземпляра", {
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
        title={`Редактирование ${instance?.data.id}`}
        breadcrumbs={[
          { label: "Экземпляры", href: "/instances" },
          {
            label: instance?.data.id ?? "...",
            href: `/instances/${instance?.data.id}`,
          },
          {
            label: "Редактирование",
            href: `/instances/${instance?.data.id}/edit`,
          },
        ]}
      />
      <Block title="Редактирование экземпляра">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FormBlock>
            <form.AppField
              name="variantId"
              children={(field) => (
                <field.Dropdown
                  label="Вариант"
                  options={
                    item?.data.variants.map((variant) => ({
                      label: variant.name,
                      value: variant.id,
                    })) ?? []
                  }
                />
              )}
            />
            <form.AppField
              name="cellId"
              children={(field) => (
                <field.TextField label="Ячейка" type="nullabletext" />
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
