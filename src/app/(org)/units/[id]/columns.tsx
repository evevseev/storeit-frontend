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
import { Unit } from "../types";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const columnHelper = createColumnHelper<Unit>();

export const createUnitColumns = (refetch: () => void) => {
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
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/units/${row.original.id}/edit`)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    mutation.mutate(
                      {
                        params: {
                          path: {
                            id: row.original.id,
                          },
                        },
                      },
                      {
                        onSuccess: () => {
                          toast.success("Подразделение успешно удалено");
                          refetch();
                        },
                        onError: (error) => {
                          toast.error("Ошибка при удалении подразделения", {
                            description: JSON.stringify(error),
                          });
                        },
                      }
                    );
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];
}; 