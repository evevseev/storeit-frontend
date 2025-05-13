import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createColumnHelper } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { components } from "@/lib/api/storeit";
import { DeleteDialog } from "@/components/dialogs/deletion";
import { useState } from "react";

const columnHelper = createColumnHelper<components["schemas"]["Unit"]>();

export function createUnitColumns() {
  const queryClient = useQueryClient();
  const client = useApiQueryClient();
  const mutation = client.useMutation("delete", "/units/{id}");
  const router = useRouter();

  return [
    columnHelper.accessor("name", {
      header: "Название",
    }),
    columnHelper.accessor("alias", {
      header: "Аббревиатура",
    }),
    columnHelper.accessor("address", {
      header: "Адрес",
    }),
    columnHelper.display({
      id: "actions",
      meta: {
        isDisplay: true,
      },
      cell: ({ row }) => {
        const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Действия</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => router.push(`/units/${row.original.id}/edit`)}
                >
                  <Pencil />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteDialog
              hideTrigger
              onDelete={() => {
                mutation.mutate(
                  {
                    params: { path: { id: row.original.id } },
                  },
                  {
                    onSuccess: () => {
                      toast.success("Подразделение успешно удалено");
                      queryClient.invalidateQueries({
                        queryKey: ["get", "/units"],
                      });
                    },
                    onError: (error) => {
                      toast.error("Ошибка при удалении подразделения", {
                        description: JSON.stringify(error),
                      });
                    },
                  }
                );
              }}
              isOpen={deleteDialogOpen}
              setIsOpen={setDeleteDialogOpen}
            />
          </div>
        );
      },
    }),
  ];
}
