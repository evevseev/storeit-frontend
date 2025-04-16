import { Plus, FolderPlus, Grid2x2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CreateGroupDialog } from "./dialogs/CreateGroupDialog";
import { StorageGroup } from "./types";

interface AddItemButtonProps {
  onAddStorageGroup: (data: {
    name: string;
    alias: string;
    description?: string;
  }) => void;

  onAddCellGroup: () => void;
  className?: string;
  parentPath: { id: string; name: string }[];
  unitId: string;
  parentId: string | null;
}

export const AddItemButton = ({
  onAddStorageGroup,
  onAddCellGroup,
  className,
  parentPath,
  unitId,
  parentId,
}: AddItemButtonProps) => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "p-0 w-8 h-8 aspect-square cursor-pointer",
              className
            )}
            title="Add Item"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsCreateGroupOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Создать Группу...
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAddCellGroup}>
            <Grid2x2 className="mr-2 h-4 w-4" />
            Создать Группу ячеек…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateGroupDialog
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
        parentPath={parentPath}
        onSubmit={onAddStorageGroup}
        parentId={parentId}
        unitId={unitId}
      />
    </>
  );
};
