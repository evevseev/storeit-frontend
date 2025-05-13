"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil, Save, X } from "lucide-react";
import { PageMetadata } from "@/components/header/page-metadata";
import {
  Block,
  BlockTextElement,
  BlockedPageRow,
} from "@/components/common-page/block";
import { useParams } from "next/navigation";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { DataTable } from "@/components/data-table";
import { HistoryTable } from "@/components/common-page/history-table";
import { ObjectType } from "@/components/common-page/history-table/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { CopyableText } from "@/components/ui/copyable-text";
import { EditedRows } from "@/lib/tanstack-table";
import InstancesView from "@/components/common-page/instances-view";
import { components } from "@/lib/api/storeit";
import CreateVariantDialog from "./create-variant-dialog";

const variantColumnHelper =
  createColumnHelper<components["schemas"]["ItemVariant"]>();

export default function ItemPage() {
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const { id } = useParams();
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [cellUuid, setCellUuid] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVariantsEditing, setIsVariantsEditing] = useState(false);

  const [editedVariantValues, setEditedVariantValues] = useState<EditedRows>(
    {}
  );

  const { data, isLoading, isError } = client.useQuery("get", "/items/{id}", {
    params: {
      path: {
        id: id as string,
      },
    },
  });

  const createInstanceMutation = client.useMutation(
    "post",
    "/items/{itemId}/instances"
  );

  const { mutate: updateVariant } = client.useMutation(
    "put",
    "/items/{id}/variants/{variantId}"
  );

  const { mutate: deleteVariant } = client.useMutation(
    "delete",
    "/items/{id}/variants/{variantId}"
  );

  const handleCreateInstance = async () => {
    if (!selectedVariant || !cellUuid) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    createInstanceMutation.mutate(
      {
        params: {
          path: {
            itemId: id as string,
          },
        },
        body: {
          variantId: selectedVariant,
          cellId: cellUuid,
        },
      },
      {
        onSuccess: () => {
          toast.success("Экземпляр успешно создан");
          globalClient.invalidateQueries({ queryKey: ["get", "/items/{id}"] });

          // Reset form
          setSelectedVariant("");
          setCellUuid("");
          setIsDialogOpen(false);
        },
        onError: (error) => {
          toast.error("Ошибка при создании экземпляра", {
            description: error.error?.message || "Неизвестная ошибка",
          });
        },
      }
    );
  };

  const handleEditVariants = () => {
    setIsVariantsEditing(true);
    setEditedVariantValues({});
  };

  const handleSaveVariants = () => {
    const editsByVariant = Object.entries(editedVariantValues).reduce<
      Record<string, components["schemas"]["ItemVariant"]>
    >((acc, [rowId, rowEdits]) => {
      const variant = data?.data?.variants.find((v) => v.id === rowId);
      console.log(rowId);
      console.log(data?.data?.variants);
      console.log(variant);
      console.log(rowEdits);

      if (!variant) return acc;

      if (!acc[variant.id]) {
        acc[variant.id] = { ...variant };
      }

      Object.entries(rowEdits).forEach(([columnId, value]) => {
        switch (columnId) {
          case "name":
            acc[variant.id].name = value as string;
            break;
          case "article":
            acc[variant.id].article = value as string;
            break;
          case "ean13":
            acc[variant.id].ean13 = value as number;
            break;
        }
      });

      return acc;
    }, {});

    Object.entries(editsByVariant).forEach(([variantId, updatedVariant]) => {
      updateVariant(
        {
          params: {
            path: {
              id: id as string,
              variantId,
            },
          },
          body: updatedVariant,
        },
        {
          onSuccess: () => {
            globalClient.invalidateQueries({
              queryKey: ["get", "/items/{id}"],
            });
          },
          onError: (error: { error: { message: string } }) => {
            toast.error("Ошибка при обновлении варианта", {
              description: error.error?.message || "Неизвестная ошибка",
            });
          },
        }
      );
    });

    if (Object.keys(editsByVariant).length > 0) {
      toast.success("Изменения сохранены");
    }

    setIsVariantsEditing(false);
    setEditedVariantValues({});
  };

  const handleCancelVariants = () => {
    setIsVariantsEditing(false);
    setEditedVariantValues({});
  };

  const handleDeleteVariant = (variantId: string) => {
    deleteVariant(
      {
        params: {
          path: {
            id: id as string,
            variantId,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Вариант успешно удален");
          globalClient.invalidateQueries({
            queryKey: ["get", "/items/{id}"],
          });
        },
        onError: (error: { error: { message: string } }) => {
          toast.error("Ошибка при удалении варианта", {
            description: error.error?.message || "Неизвестная ошибка",
          });
        },
      }
    );
  };

  const variantColumns = [
    variantColumnHelper.accessor("name", {
      header: "Название",
      meta: {
        isEditable: true,
        type: "text",
      },
    }),
    variantColumnHelper.accessor("article", {
      header: "Артикул",
      meta: {
        isEditable: true,
        type: "text",
      },
    }),
    variantColumnHelper.accessor("ean13", {
      header: "EAN13",
      meta: {
        isEditable: true,
        type: "number",
      },
    }),
    variantColumnHelper.display({
      id: "actions",
      meta: {
        isDisplay: true,
      },
      cell: (props) => (
        <div className="text-right">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:cursor-pointer"
            onClick={() => {
              handleDeleteVariant(props.row.original.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ];

  if (isError) {
    return <div>Ошибка при загрузке данных</div>;
  }

  if (!data) {
    return <div>Data not found</div>;
  }

  if (!data.data) {
    return <div>Data not found</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      <PageMetadata
        title={data.data.name}
        breadcrumbs={[
          { href: "/items", label: "Товары" },
          { label: data.data.name },
        ]}
      />
      <BlockedPageRow>
        <Block title="Информация о товаре" isLoading={isLoading}>
          <BlockTextElement label="Название" value={data.data.name} />
          <BlockTextElement
            label="Описание"
            value={data.data.description ?? ""}
          />
          <BlockTextElement label="ID">
            <CopyableText>{data.data.id}</CopyableText>
          </BlockTextElement>
        </Block>
      </BlockedPageRow>
      <BlockedPageRow>
        <Block title="Варианты">
          <div className="flex justify-end gap-2">
            {isVariantsEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelVariants}>
                  <X />
                  Отменить
                </Button>
                <Button onClick={handleSaveVariants}>
                  <Save />
                  Сохранить
                </Button>
              </div>
            ) : (
              <Button onClick={handleEditVariants}>
                <Pencil />
                Редактировать
              </Button>
            )}
            <CreateVariantDialog itemId={id as string} />
          </div>
          <DataTable
            columns={variantColumns}
            data={data?.data?.variants}
            editMode={isVariantsEditing}
            changedRows={editedVariantValues}
            setChangedRows={setEditedVariantValues}
            getRowId={(row) => row.id}
          />
        </Block>
      </BlockedPageRow>
      <InstancesView />
      <HistoryTable objectType={ObjectType.Item} objectId={id as string} />
    </div>
  );
}
