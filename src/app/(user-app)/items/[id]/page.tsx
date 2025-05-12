"use client";

import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import { Plus, Trash2, Pencil, Save, X } from "lucide-react";
import { PageMetadata } from "@/components/header/page-metadata";
import {
  Block,
  BlockTextElement,
  BlockCustomElement,
  BlockRow,
  BlockedPageRow,
} from "@/components/common-page/block";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReactTable, createColumnHelper } from "@tanstack/react-table";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { DataTable } from "@/components/data-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { HistoryTable } from "@/components/common-page/history-table";
import { ObjectType } from "@/components/common-page/history-table/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopyableText } from "@/components/ui/copyable-text";
import { defaultColumn, EditedCellValue } from "@/lib/tanstack-table";
import InstancesView from "@/components/common-page/instances-view";

type Item = {
  id: string;
  name: string;
  description: string | null;
  variants: Variant[];
};

type Variant = {
  id: string;
  name: string;
  article: string | null;
  ean13: number | null;
};

const variantColumnHelper = createColumnHelper<Variant>();

export default function ItemPage() {
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const { id } = useParams();
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [cellUuid, setCellUuid] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVariantsEditing, setIsVariantsEditing] = useState(false);
  const [editedVariantValues, setEditedVariantValues] = useState<
    EditedCellValue[]
  >([]);
  const [selectedVariants, setSelectedVariants] = useState<RowSelectionState>(
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
    setEditedVariantValues([]);
  };

  const handleSaveVariants = () => {
    const editsByVariant = editedVariantValues.reduce((acc, edit) => {
      const variant = data?.data?.variants[edit.rowIndex];
      if (!variant) return acc;

      if (!acc[variant.id]) {
        acc[variant.id] = { ...variant };
      }

      switch (edit.columnId) {
        case "name":
          acc[variant.id].name = edit.value as string;
          break;
        case "article":
          acc[variant.id].article = edit.value as string;
          break;
        case "ean13":
          acc[variant.id].ean13 = edit.value as number;
          break;
      }

      return acc;
    }, {} as Record<string, Variant>);

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
    setEditedVariantValues([]);
  };

  const handleCancelVariants = () => {
    setIsVariantsEditing(false);
    setEditedVariantValues([]);
    globalClient.invalidateQueries({
      queryKey: ["get", "/items/{id}"],
    });
  };

  const variantColumns = [
    variantColumnHelper.accessor("name", {
      header: "Название",
    }),
    variantColumnHelper.accessor("article", {
      header: "Артикул",
    }),
    variantColumnHelper.accessor("ean13", {
      header: "EAN13",
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
              alert(props.row.original.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ];

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

  // Update the actions column to use delete handler
  variantColumns[3].cell = (props) => (
    <div className="text-right">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 hover:cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteVariant(props.row.original.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const table = useReactTable({
    data: data?.data?.variants ?? [],
    columns: variantColumns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn,
    meta: {
      addEditedValue: (value: EditedCellValue) => {
        setEditedVariantValues((prev) => {
          const filtered = prev.filter(
            (edit) =>
              !(
                edit.rowIndex === value.rowIndex &&
                edit.columnId === value.columnId
              )
          );
          return [...filtered, value];
        });
      },
    },
  });

  useEffect(() => {
    if (data && data.data) {
      const variants = data.data.variants?.map((variant: Variant) => ({
        id: variant.id,
        name: variant.name,
        article: variant.article,
        ean13: variant.ean13,
      }));
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
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
        <Block title="Информация о товаре">
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
          <div className="flex justify-end py-4">
            {isVariantsEditing ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelVariants}
                >
                  <X className="mr-2 h-4 w-4" />
                  Отмена
                </Button>
                <Button size="sm" onClick={handleSaveVariants}>
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={handleEditVariants}>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
              </Button>
            )}
          </div>
          <div className="border rounded-md">
            <div className="overflow-x-auto">
              <DataTable
                columns={variantColumns}
                data={data?.data?.variants}
                defaultColumn={defaultColumn}
                editMode={isVariantsEditing}
                meta={{
                  addEditedValue: (value: EditedCellValue) => {
                    setEditedVariantValues((prev) => {
                      const filtered = prev.filter(
                        (edit) =>
                          !(
                            edit.rowIndex === value.rowIndex &&
                            edit.columnId === value.columnId
                          )
                      );
                      return [...filtered, value];
                    });
                  },
                }}
              />
            </div>
          </div>
        </Block>
      </BlockedPageRow>
      <InstancesView />
      <HistoryTable objectType={ObjectType.Item} objectId={id as string} />
    </div>
  );
}
