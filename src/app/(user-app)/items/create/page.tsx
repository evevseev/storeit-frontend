"use client";

import { useAppForm } from "@/components/common-form";
import { PageMetadata } from "@/components/header/page-metadata";
import { Block, BlockedPage, BlockRow } from "@/components/common-page/block";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { VariantField } from "@/components/variant-field";
import { Variant } from "@/components/variant-table";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";

const validator = z.object({
  name: z.string().min(1),
  description: z.string(),
  variants: z.array(
    z.object({
      id: z.string().nullable(),
      name: z.string().min(1),
      sku: z.string(),
      ean13: z.string(),
    })
  ),
});

export default function CreateItemPage() {
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const router = useRouter();

  const createItemMutation = client.useMutation("post", "/items");
  const createVariantMutation = client.useMutation(
    "post",
    "/items/{id}/variants"
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      variants: [] as Variant[],
    },
    validators: {
      onChange: validator,
    },
    onSubmit: async (data) => {
      try {
        createItemMutation.mutate(
          {
            body: {
              name: data.value.name,
              description: data.value.description,
            },
          },
          {
            onSuccess: (itemResponse) => {
              const itemId = itemResponse.data.id;

              Promise.all(
                data.value.variants.map((variant) =>
                  createVariantMutation.mutate({
                    params: {
                      path: {
                        id: itemId,
                      },
                    },
                    body: {
                      name: variant.name,
                      article: variant.sku || null,
                      ean13: variant.ean13 ? parseInt(variant.ean13) : null,
                    },
                  })
                )
              ).then(() => {
                toast.success("Товар успешно создан");
                globalClient.invalidateQueries({ queryKey: ["get", "/items"] });
                router.push(`/items/${itemId}`);
              });
            },
            onError: (error: any) => {
              toast.error("Ошибка при создании товара", {
                description: error.error?.message || "Неизвестная ошибка",
              });
            },
          }
        );
      } catch (error: any) {
        toast.error("Ошибка при создании товара", {
          description: error.error?.message || "Неизвестная ошибка",
        });
      }
    },
  });

  return (
    <>
      <PageMetadata title="Создание товара" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <BlockedPage>
          <Block title="Основная информация">
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
            {/* <BlockRow>
              <form.AppField
                name="width"
                children={(field) => (
                  <field.TextField label="Ширина" unit="мм" type="number" />
                )}
              />
              <form.AppField
                name="height"
                children={(field) => (
                  <field.TextField label="Высота" unit="мм" type="number" />
                )}
              />
              <form.AppField
                name="length"
                children={(field) => (
                  <field.TextField label="Длина" unit="мм" type="number" />
                )}
              />
              <form.AppField
                name="weight"
                children={(field) => (
                  <field.TextField label="Вес" unit="кг" type="number" />
                )}
              />
            </BlockRow> */}
          </Block>
          <Block title="Варианты">
            <form.AppField name="variants" children={() => <VariantField />} />
          </Block>
          <form.AppForm>
            <form.SubmitButton label="Создать" />
          </form.AppForm>
        </BlockedPage>
      </form>
    </>
  );
}
