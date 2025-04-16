"use client";

import { useAtomValue, useSetAtom } from "jotai";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { OrganizationUnit } from "./types";
import { organizationUnitMatchesSearch, matchesSearch } from "./utils";
import { ElementMenu } from "./ElementMenu";
import { StorageGroupItem } from "./StorageGroupItem";
import { itemOpenAtom, toggleItemAtom } from "./atoms";
import { AddItemButton } from "./AddItemButton";
import { cn } from "@/lib/utils";

interface OrganizationUnitItemProps {
  item: OrganizationUnit;
  searchQuery: string;
}

const onAddStorageGroup = (
  organizationId: string,
  data: { name: string; alias: string; description?: string }
) => {
  alert(`Creating storage group in organization ${organizationId}`);
};

const onAddCellGroup = (storageGroupId: string) => {
  alert(`Creating cell group in storage group ${storageGroupId}`);
};

const onAddChild = (storageGroupId: string) => {
  alert(`Creating child in storage group ${storageGroupId}`);
};

export const OrganizationUnitItem = ({
  item,
  searchQuery,
}: OrganizationUnitItemProps) => {
  const isExpanded = useAtomValue(itemOpenAtom(item.id));
  const toggleItem = useSetAtom(toggleItemAtom);

  const hasMatchingChildren = organizationUnitMatchesSearch(item, searchQuery);
  const isExactMatch = matchesSearch(item, searchQuery);
  const shouldShow = !searchQuery || hasMatchingChildren;
  const highlightClass =
    searchQuery && isExactMatch ? "bg-yellow-50" : "bg-gray-100";

  if (!shouldShow) return null;

  return (
    <div className="mb-4">
      <div
        className={cn("py-2 rounded-lg border border-gray-300", highlightClass)}
      >
        <div className="flex items-center group px-2">
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
          <Link
            href={`/units/${item.id}`}
            className="flex-1 flex items-center hover:underline"
          >
            <div className="ml-2">
              <div className="flex items-center">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({item.alias})
                </span>
              </div>
              {item.address && (
                <p className="text-xs text-muted-foreground">{item.address}</p>
              )}
            </div>
          </Link>
          <div className="flex items-center">
            {onAddStorageGroup && (
              <AddItemButton
                className="mr-2"
                onAddStorageGroup={(data) => onAddStorageGroup(item.id, data)}
                onAddCellGroup={() => onAddChild?.(item.id)}
                parentPath={[{ id: item.id, name: item.name }]}
                unitId={item.id}
                parentId={null}
              />
            )}
            <ElementMenu />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2">
          {item.children.map((storageGroup, index) => (
            <StorageGroupItem
              key={storageGroup.id}
              item={storageGroup}
              searchQuery={searchQuery}
              isLast={index === item.children.length - 1}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
};
