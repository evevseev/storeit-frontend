"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WarehouseData } from "./types";
import { warehouseData } from "./data";
import { OrganizationUnitItem } from "./OrganizationUnitItem";

interface WarehouseStructureProps {
  data?: WarehouseData;
  showSearch?: boolean;
  className?: string;
  onAddStorageGroup?: (organizationId: string) => void;
  onAddChild?: (storageGroupId: string) => void;
}

export default function WarehouseStructure({
  data = warehouseData,
  showSearch = true,
  className,
  onAddStorageGroup,
  onAddChild,
}: WarehouseStructureProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={cn("space-y-4", className)}>
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search warehouse structure..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="space-y-0.5">
        {data.map((organizationUnit) => (
          <OrganizationUnitItem
            key={organizationUnit.id}
            item={organizationUnit}
            searchQuery={searchQuery}
            onAddStorageGroup={onAddStorageGroup}
            onAddChild={onAddChild}
          />
        ))}
      </div>
    </div>
  );
} 