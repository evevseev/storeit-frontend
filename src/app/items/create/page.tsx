"use client";

import { useAppForm } from "@/components/common-form";
import { PageMetadata } from "@/components/header/page-metadata";
import { Block } from "@/components/common-page/block";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { VariantField } from "@/components/common-form/variant-field";
import { Variant } from "@/components/common-form/variant-table";

export default function CreateItemPage() {
  const client = useApiQueryClient();
  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      width: 0,
      height: 0,
      length: 0,
      weight: 0,
      variants: [] as Variant[],
    },
  });

  return (
    <>
      <PageMetadata title="Создание товара" />
      <>
        <form>
          <Block title="Основная информация">
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="Название" />}
            />
            <form.AppField
              name="description"
              children={(field) => <field.TextField label="Описание" />}
            />
            <div className="flex gap-2">
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
            </div>
          </Block>
          <Block title="Варианты">
            <form.AppField
              name="variants"
              children={() => <VariantField />}
            />
          </Block>
        </form>
      </>
    </>
  );
}
