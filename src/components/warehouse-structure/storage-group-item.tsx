import { useAtomValue, useSetAtom } from "jotai";
import Link from "next/link";
import { ChevronDown, ChevronRight, FolderOpen } from "lucide-react";
import { StorageGroup } from "./types";
import { storageGroupMatchesSearch, matchesSearch } from "./utils";
import { ItemDropdown } from "./item-dropdown";
import { CellGroupItem } from "./CellGroupItem";
import { itemOpenAtom, toggleItemAtom } from "./atoms";
import { GroupsCreationButton } from "./AddItemButton";
import { PrintLabelButton } from "./print-label-button";

interface StorageGroupItemProps {
  item: StorageGroup;
  level?: number;
  searchQuery: string;
  isLast?: boolean;
  onAddChild?: (storageGroupId: string) => void;
  parentPath?: { id: string; name: string }[];
}

export const StorageGroupItem = ({
  item,
  level = 0,
  searchQuery,
  isLast = false,
  parentPath = [],
}: StorageGroupItemProps) => {
  const isExpanded = useAtomValue(itemOpenAtom(item.id));
  const toggleItem = useSetAtom(toggleItemAtom);

  const hasMatchingChildren = storageGroupMatchesSearch(item, searchQuery);
  const isExactMatch = matchesSearch(item, searchQuery);
  const shouldShow = !searchQuery || hasMatchingChildren;
  const highlightClass =
    searchQuery && isExactMatch ? "bg-yellow-50" : "bg-gray-50/50";

  const currentPath = [...parentPath, { id: item.id, name: item.name }];

  if (!shouldShow) return null;

  // Filter visible children based on search
  const visibleChildren = item.children.filter((child) => {
    return !searchQuery || matchesSearch(child, searchQuery);
  });

  return (
    <div className={`pl-8 relative ${!isLast ? "mb-2" : ""}`}>
      {level > 0 && (
        <>
          {/* Vertical line connecting to parent */}
          <div
            className={`absolute left-4 -top-2 w-px bg-gray-300 ${
              isLast ? "h-[2.25rem]" : "h-[calc(100%+0.5rem)]"
            }`}
          ></div>

          {/* Horizontal line connecting to vertical line */}
          <div className="absolute left-4 top-[1.75rem] w-4 h-px bg-gray-300"></div>
        </>
      )}

      <div
        className={`py-2 rounded-lg ${highlightClass} border border-gray-200`}
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
          <div className="w-6 flex items-center justify-center">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <Link
            href={`/storage-groups/${item.id}`}
            className="flex-1 flex items-center hover:underline"
          >
            <div className="ml-2">
              <div className="flex items-center">
                <span className="text-sm">{item.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({item.alias})
                </span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <PrintLabelButton
              labels={[
                {
                  url: `https://store-it.ru/storage-groups/${item.id}`,
                  name: item.alias,
                  description: `Группа хранения\n${item.name}`,
                },
              ]}
            />
            <GroupsCreationButton
              className="mr-2"
              parentPath={currentPath}
              unitId={item.unitId}
              parentId={item.id}
            />
            <ItemDropdown type="storage-group" id={item.id} />
          </div>
        </div>
      </div>

      {isExpanded && visibleChildren.length > 0 && (
        <div className="mt-2">
          {item.children.map((child, _) => {
            // Check if the child should be visible
            const childShouldShow =
              !searchQuery || matchesSearch(child, searchQuery);

            if (!childShouldShow) return null;

            // Find the index among visible children
            const visibleIndex = visibleChildren.findIndex(
              (vc) => vc.id === child.id
            );
            const isLastVisible = visibleIndex === visibleChildren.length - 1;

            return (
              <StorageGroupItem
                key={child.id}
                item={child}
                level={level + 1}
                searchQuery={searchQuery}
                isLast={isLastVisible}
                parentPath={currentPath}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
