"use client";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState, useRef, useCallback } from "react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ItemDropdownProps {
  type: "unit" | "storage-group" | "cells-group";
  id: string;
}

export const ItemDropdown = ({ type, id }: ItemDropdownProps) => {
  const queryClient = useApiQueryClient();
  const globalQueryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      const endpoint = type === "unit" 
        ? `/units/${id}`
        : type === "storage-group"
        ? `/storage-groups/${id}`
        : `/cells-groups/${id}`;

      await queryClient.mutate("delete", endpoint);
      toast.success("Успешно удалено");
      globalQueryClient.invalidateQueries({ queryKey: ["get", `/${type}s`] });
    } catch (error) {
      toast.error("Ошибка при удалении");
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
        <DropdownMenuItem onClick={handleDelete}>Удалить</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
