"use client";
import { FormBlock, useAppForm } from "@/components/common-form";
import { BlockedPage } from "@/components/common-page/block";
import { DataTable } from "@/components/data-table";
import { PageMetadata } from "@/components/header/page-metadata";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { createColumnHelper } from "@tanstack/react-table";
import { Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { FormInputDropdown } from "@/components/common-form/text-field";

type TVBoardResponse = {
  id: string;
  name: string;
  token: string;
  unit: {
    id: string;
    name: string;
    alias: string;
    address: string | null;
  };
};

type TVBoard = {
  id: string;
  name: string;
  token: string;
  unitId: string;
};

type Unit = {
  id: string;
  name: string;
  alias: string;
  address: string | null;
};

function useTokenVisibility() {
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());

  const toggleTokenVisibility = (tokenId: string) => {
    setVisibleTokens((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId);
      } else {
        newSet.add(tokenId);
      }
      return newSet;
    });
  };

  return { visibleTokens, toggleTokenVisibility };
}

function useTokenColumns(
  visibleTokens: Set<string>,
  toggleTokenVisibility: (id: string) => void,
  handleDeleteToken: (id: string) => void
) {
  const columnHelper = createColumnHelper<TVBoard>();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Ссылка скопирована в буфер обмена");
  };

  return [
    columnHelper.accessor("name", {
      header: "Название",
    }),
    columnHelper.accessor("token", {
      header: "Ссылка для подключения",
      cell: ({ row }) => {
        const board = row.original;
        const isVisible = visibleTokens.has(board.id);
        const link =
          process.env.NEXT_PUBLIC_APP_URL + "/tv-board/" + board.token;

        return (
          <div className="flex items-center gap-2">
            {isVisible ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {link}
              </a>
            ) : (
              <span>••••••••••••••••</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(link)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleTokenVisibility(board.id)}
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      meta: {
        isDisplay: true,
      },
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteToken(row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    }),
  ];
}

function CreateTbBoardDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const client = useApiQueryClient();
  const globalClient = useQueryClient();

  const { mutate } = client.useMutation("post", "/tv-boards");
  const { data: unitsResponse } = client.useQuery("get", "/units");
  const units = unitsResponse?.data ?? [];

  const handleSubmit = (data: { value: { name: string; unitId: string } }) => {
    mutate(
      {
        body: {
          name: data.value.name,
          unitId: data.value.unitId,
        },
      },
      {
        onSuccess: () => {
          globalClient.invalidateQueries({
            queryKey: ["get", "/tv-boards"],
          });
          toast.success("ТВ-борд успешно создан");
          setIsOpen(false);
        },
        onError: (error) => {
          toast.error("Не удалось создать ТВ-борд", {
            description: error.error.message,
          });
        },
      }
    );
  };

  const form = useAppForm({
    defaultValues: {
      name: "",
      unitId: "",
    },
    onSubmit: handleSubmit,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Создать ТВ-борд
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Создание ТВ-борда</DialogTitle>
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
                  label="Название ТВ-борда"
                  placeholder="ТВ-борд 1"
                />
              )}
            />
            <form.AppField
              name="unitId"
              children={(field) => (
                <FormInputDropdown
                  label="Подразделение"
                  options={units.map((unit: Unit) => ({
                    value: unit.id,
                    label: unit.name,
                  }))}
                  placeholder="Выберите подразделение"
                />
              )}
            />

            <DialogFooter>
              <form.AppForm>
                <form.SubmitButton label="Создать" />
              </form.AppForm>
            </DialogFooter>
          </FormBlock>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function TVBoardsPage() {
  const client = useApiQueryClient();
  const queryClient = useQueryClient();
  const { data, isPending } = client.useQuery("get", "/tv-boards");
  const [boards, setBoards] = useState<TVBoard[]>([]);
  const { setPageMetadata } = usePageMetadata();

  const { mutate: deleteBoard } = client.useMutation(
    "delete",
    "/tv-boards/{id}"
  );

  const handleDeleteBoard = (boardId: string) => {
    deleteBoard(
      { params: { path: { id: boardId } } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/tv-boards"] });
          toast.success("ТВ-борд успешно удален");
        },
        onError: (error) => {
          toast.error("Не удалось удалить ТВ-борд", {
            description: error.error.message,
          });
        },
      }
    );
  };

  useEffect(() => {
    if (data) {
      setBoards(
        data.data.map((board: TVBoardResponse) => ({
          id: board.id,
          name: board.name,
          token: board.token,
          unitId: board.unit.id,
        }))
      );
    }
  }, [data]);

  const { visibleTokens, toggleTokenVisibility } = useTokenVisibility();
  const columns = useTokenColumns(
    visibleTokens,
    toggleTokenVisibility,
    handleDeleteBoard
  );

  useEffect(() => {
    setPageMetadata({
      title: "ТВ-борды",
      breadcrumbs: [
        { label: "Организация" },
        { label: "ТВ-борды", href: "/tv-boards" },
      ],
      actions: [<CreateTbBoardDialog />],
    });
  }, []);

  return (
    <BlockedPage>
      <DataTable columns={columns} data={boards ?? []} isLoading={isPending} />
    </BlockedPage>
  );
}
