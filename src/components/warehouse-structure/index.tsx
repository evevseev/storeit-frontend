"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WarehouseData } from "./types";
import { warehouseData } from "./data";
import { OrganizationUnitItem } from "./OrganizationUnitItem";
import { cleanupRemovedItemsAtom } from "./atoms";

interface WarehouseStructureProps {
  data?: WarehouseData;
  showSearch?: boolean;
  className?: string;
  onAddStorageGroup?: (organizationId: string) => void;
  onAddChild?: (storageGroupId: string) => void;
  onCreateUnit?: () => void;
}

export default function WarehouseStructure({
  data = warehouseData,
  showSearch = true,
  className,
  onAddStorageGroup = (organizationId) => {
    alert(`Creating storage group in organization ${organizationId}`);
  },
  onAddChild = (storageGroupId) => {
    alert(`Creating child in storage group ${storageGroupId}`);
  },
  onCreateUnit = () => {
    alert("Creating new organization unit");
  },
}: WarehouseStructureProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [, cleanupRemovedItems] = useAtom(cleanupRemovedItemsAtom);

  // Clean up removed items whenever the data changes
  useEffect(() => {
    cleanupRemovedItems(data);
  }, [data, cleanupRemovedItems]);

  return (
    <div className={cn("space-y-4", className)}>
      {showSearch && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search warehouse structure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 w-full"
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
          <Button
            onClick={onCreateUnit}
            className="whitespace-nowrap"
            variant="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Unit
          </Button>
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
