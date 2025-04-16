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

interface ElementMenuProps {
  className?: string;
}

export const ElementMenu = ({ className }: ElementMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const openTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const closeTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const clearTimeouts = useCallback(() => {
    if (openTimeout.current) {
      clearTimeout(openTimeout.current);
      openTimeout.current = undefined;
    }
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = undefined;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearTimeouts();
    openTimeout.current = setTimeout(() => {
      setIsOpen(true);
    }, 300);
  }, [clearTimeouts]);

  const handleMouseLeave = useCallback(() => {
    clearTimeouts();
    closeTimeout.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  }, [clearTimeouts]);

  return (
    <DropdownMenu open={isOpen} modal={false}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-0 w-8 h-8 aspect-square cursor-pointer",
              className
            )}
            onClick={(e) => e.preventDefault()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          forceMount
        >
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Редактировать...
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Удалть...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};
