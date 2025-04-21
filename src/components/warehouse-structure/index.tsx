"use client";

import { SearchBar } from "./components/search-bar";
import { OrganizationUnitItem } from "./organization-unit-item";
import { useWarehouseSearch } from "./hooks/use-warehouse-search";
import { useWarehouseStructure } from "./hooks/use-warehouse-structure";
import { Skeleton } from "@/components/ui/skeleton";

export default function WarehouseStructure() {
  const { searchQuery, handleSearch, clearSearch } = useWarehouseSearch();
  const { units, isLoading, error } = useWarehouseStructure();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-0.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <div className="pl-6 space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                  <Skeleton key={j} className="h-10 w-[95%]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          onClear={clearSearch}
        />
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
