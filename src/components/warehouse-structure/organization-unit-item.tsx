"use client";

import { useAtomValue, useSetAtom } from "jotai";
import Link from "next/link";
import { ChevronDown, ChevronRight, Building2 } from "lucide-react";
import { OrganizationUnit, StorageGroup } from "./types";
import { organizationUnitMatchesSearch, matchesSearch } from "./utils";
import { StorageGroupItem } from "./storage-group-item";
import { itemOpenAtom, toggleItemAtom } from "./atoms";
import { GroupsCreationButton } from "./AddItemButton";
import { cn } from "@/lib/utils";
import { PrintLabelButton } from "./print-label-button";
import { ItemDropdown } from "./item-dropdown";

interface OrganizationUnitItemProps {
  item: OrganizationUnit;
  searchQuery: string;
  isLast: boolean;
}

export const OrganizationUnitItem = ({
  item,
  searchQuery,
  isLast,
}: OrganizationUnitItemProps) => {
  const isExpanded = useAtomValue(itemOpenAtom(item.id));
  const toggleItem = useSetAtom(toggleItemAtom);

  const hasMatchingChildren = organizationUnitMatchesSearch(item, searchQuery);
  const isExactMatch = matchesSearch(item, searchQuery);
  const shouldShow = !searchQuery || hasMatchingChildren;
  const highlightClass =
    searchQuery && isExactMatch ? "bg-yellow-50" : "bg-gray-50/50";

  if (!shouldShow) return null;

  const visibleChildren = item.children.filter((child: StorageGroup) =>
    organizationUnitMatchesSearch(
      { ...child, address: null, children: [] },
      searchQuery
    )
  );

  return (
    <div className={`relative ${!isLast ? "mb-2" : ""}`}>
      <div
        className={cn("py-2 rounded-lg border border-gray-200", highlightClass)}
      >
        {/* <div className="flex items-center group px-2">
          {item.children && item.children.length > 0 && (
            <button
              onClick={() => toggleItem({ itemId: item.id, item })}
              className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          <div className="w-6 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <Link
            href={`/units/${item.id}`}
            className="flex-1 flex items-center hover:underline"
          >
            <div className="ml-2">
              <div className="flex items-center">
                <span className="text-sm">{item.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({item.alias})
                </span>
              </div>
              {item.address && (
                <div className="text-xs text-muted-foreground">
                  {item.address}
                </div>
              )}
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <PrintLabelButton
              labels={[
                {
                  url: `https://store-it.ru/units/${item.id}`,
                  name: item.alias,
                  description: `Подразделение\n${item.address ?? ""}`,
                },
              ]}
            />
            <GroupsCreationButton
              className="mr-2"
              parentPath={[{ id: item.id, name: item.name }]}
              unitId={item.id}
              parentId={null}
            />
            <ItemDropdown type="unit" id={item.id} />
          </div>
        </div> */}
      </div>

      {/* {isExpanded && visibleChildren.length > 0 && (
        <div className="mt-2 pl-8">
          {visibleChildren.map((storageGroup, index) => (
            <StorageGroupItem
              key={storageGroup.id}
              item={storageGroup}
              searchQuery={searchQuery}
              isLast={index === visibleChildren.length - 1}
              parentPath={[{ id: item.id, name: item.name }]}
            />
          ))}
        </div>
      )} */}
    </div>
  );
};
