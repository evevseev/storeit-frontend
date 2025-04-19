"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrganizationUnit } from "./types";
import { OrganizationUnitItem } from "./organization-unit-item";

interface WarehouseStructureProps {
  units?: OrganizationUnit[];
}

export default function WarehouseStructure({ units }: WarehouseStructureProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по структуре склада..."
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
      </div>
    </div>
  );
}
