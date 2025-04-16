"use client";

import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrganizationUnit, StorageGroup } from "./types";
import { OrganizationUnitItem } from "./OrganizationUnitItem";
import { cleanupRemovedItemsAtom } from "./atoms";
import { StorageGroupItem } from "./StorageGroupItem";

interface WarehouseStructureProps {
  units?: OrganizationUnit[];
  storageGroups?: StorageGroup[];
  className?: string;
}

export default function WarehouseStructure({
  units,
  storageGroups,
  className,
}: WarehouseStructureProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // const cleanupRemovedItems = useSetAtom(cleanupRemovedItemsAtom);

  // Clean up removed items whenever the data changes
  // useEffect(() => {
  //   cleanupRemovedItems(data);
  // }, [data, cleanupRemovedItems]);

  return (
    <div className={cn("space-y-4", className)}>
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
      </div>

      <div className="space-y-0.5">
        {units &&
          units.length > 0 &&
          units.map((organizationUnit) => (
            <OrganizationUnitItem
              key={organizationUnit.id}
              item={organizationUnit}
              searchQuery={searchQuery}
            />
          ))}
        {storageGroups &&
          storageGroups.length > 0 &&
          storageGroups.map((storageGroup) => (
            <StorageGroupItem
              key={storageGroup.id}
              item={storageGroup}
              searchQuery={searchQuery}
            />
          ))}
      </div>
    </div>
  );
}
