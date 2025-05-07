"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useWarehouseStructure } from "./hooks/use-warehouse-structure";
import { OrganizationUnitItem } from "./organization-unit-item";
import { searchQueryAtom } from "./atoms";
import { organizationUnitMatchesSearch } from "./utils";
import { Skeleton } from "../ui/skeleton";

const WarehouseStructure = () => {
  const { units, isLoading, error } = useWarehouseStructure();
  const searchQuery = useAtomValue(searchQueryAtom);
  const setSearchQuery = useSetAtom(searchQueryAtom);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (error || !units) {
    return null;
  }

  const visibleUnits = units.filter((unit) =>
    organizationUnitMatchesSearch(unit, searchQuery)
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Поиск..."
        onChange={handleSearchChange}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      {visibleUnits.map((organizationUnit, index) => (
        <OrganizationUnitItem
          key={organizationUnit.id}
          item={organizationUnit}
          searchQuery={searchQuery}
          isLast={index === visibleUnits.length - 1}
        />
      ))}
      {visibleUnits.length === 0 && searchQuery && (
        <div className="text-center text-muted-foreground py-8">
          По запросу "{searchQuery}" ничего не найдено
        </div>
      )}
    </div>
  );
};

export default WarehouseStructure;
