"use client";

import { useAtomValue, useSetAtom } from "jotai";
import Link from "next/link";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { OrganizationUnit } from "./types";
import { organizationUnitMatchesSearch, matchesSearch } from "./utils";
import { ElementMenu } from "./ElementMenu";
import { StorageGroupItem } from "./StorageGroupItem";
import { itemOpenAtom, toggleItemAtom } from "./atoms";

interface OrganizationUnitItemProps {
  item: OrganizationUnit;
  searchQuery: string;
  onAddStorageGroup?: (organizationId: string) => void;
  onAddChild?: (storageGroupId: string) => void;
}

export const OrganizationUnitItem = ({
  item,
  searchQuery,
  onAddStorageGroup,
  onAddChild,
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
        className={`py-2 rounded-lg ${highlightClass} border border-gray-300`}
      >
        <div className="flex items-center group px-2">
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
          <Link
            href={item.link}
            className="flex-1 flex items-center hover:underline"
          >
            <div className="ml-2">
              <div className="flex items-center">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({item.shortName})
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </Link>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            {onAddStorageGroup && (
              <button
                onClick={() => onAddStorageGroup(item.id)}
                className="mr-2 p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
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
