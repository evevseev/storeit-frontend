"use client";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "../dialogs/deletion";

interface ItemDropdownProps {
  type: "unit" | "storage-group" | "cells-group";
  id: string;
}

export const ItemDropdown = ({ type, id }: ItemDropdownProps) => {
  const queryClient = useApiQueryClient();
  const globalQueryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteUnit } = queryClient.useMutation(
    "delete",
    "/units/{id}"
  );

  const { mutate: deleteStorageGroup } = queryClient.useMutation(
    "delete",
    "/storage-groups/{id}"
  );

  const { mutate: deleteCellsGroup } = queryClient.useMutation(
    "delete",
    "/cells-groups/{groupId}"
  );

  const handleDelete = async () => {
    try {
      if (type === "unit") {
        deleteUnit({ params: { path: { id } } });
      } else if (type === "storage-group") {
        deleteStorageGroup({ params: { path: { id } } });
      } else if (type === "cells-group") {
        deleteCellsGroup({ params: { path: { groupId: id } } });
      }
      toast.success("Успешно удалено");
      globalQueryClient.invalidateQueries({ queryKey: ["get", `/${type}s`] });
    } catch (error) {
      toast.error("Ошибка при удалении", {
        description: (error as any).error.message,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setDeleteDialogOpen(true)}
          variant="destructive"
        >
          <Trash2 />
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DeleteDialog
        hideTrigger
        onDelete={handleDelete}
        isOpen={deleteDialogOpen}
        setIsOpen={setDeleteDialogOpen}
      />
    </DropdownMenu>
  );
};
