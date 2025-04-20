"use client";
import { useAppForm } from "@/components/common-form";
import { Block, BlockedPage } from "@/components/common-page/block";
import { DataTable } from "@/components/data-table";
import { PageMetadata } from "@/components/header/page-metadata";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { use, useEffect, useState } from "react";

type Token = {
  id: string;
  name: string;
  token: string;
};

const columnHelper = createColumnHelper<Token>();

export default function ApiTokensPage() {
  const client = useApiQueryClient();
  const { data, isPending } = client.useQuery("get", "/api-tokens");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());
  const { mutate: deleteToken } = client.useMutation(
    "delete",
    "/api-tokens/{id}"
  );
  const queryClient = useQueryClient();

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

  const handleDeleteToken = (tokenId: string) => {
    deleteToken(
      { params: { path: { id: tokenId } } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/api-tokens"] });
          toast.success("Токен успешно удален");
        },
        onError: (error) => {
          toast.error("Не удалось удалить токен", {
            description: error.message,
          });
        },
      }
    );
  };

  const columns = [
    columnHelper.accessor("name", {
      header: "Название",
    }),
    columnHelper.accessor("token", {
      header: "Токен",
      cell: ({ row }) => {
        const token = row.original;
        const isVisible = visibleTokens.has(token.id);
        return (
          <div className="flex items-center gap-2">
            <span>{isVisible ? token.token : "••••••••••••••••"}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleTokenVisibility(token.id)}
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

  useEffect(() => {
    if (data) {
      setTokens(
        data.data.map((token) => ({
          id: token.id,
          name: token.name,
          token: token.token,
        }))
      );
    }
  }, [data]);
  return (
    <BlockedPage>
      <PageMetadata
        title="API токены"
        breadcrumbs={[
          { label: "Организация" },
          { label: "API токены", href: "/api-tokens" },
        ]}
        actions={[<CreateTokenDialog />]}
      />
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={tokens ?? []} />
      )}
    </BlockedPage>
  );
}

function CreateTokenDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const client = useApiQueryClient();
  const globalClient = useQueryClient();
  const { mutate } = client.useMutation("post", "/api-tokens");
  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1),
      }),
    },
    onSubmit: (data) => {
      mutate(
        {
          body: {
            name: data.value.name,
          },
        },
        {
          onSuccess: () => {
            globalClient.invalidateQueries({
              queryKey: ["get", "/api-tokens"],
            });
            toast.success("Токен успешно создан");
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error("Не удалось создать токен", {
              description: error.message,
            });
          },
        }
      );
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Создать API-токен
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Создание API-токена</DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Название токена"
                  placeholder="Интеграция с CRM"
                />
              )}
            />

            <DialogFooter>
              <form.AppForm>
                <form.SubmitButton label="Создать" />
              </form.AppForm>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
