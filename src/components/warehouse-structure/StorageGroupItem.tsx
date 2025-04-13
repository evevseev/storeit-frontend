import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, FolderOpen, Plus } from "lucide-react";
import { StorageGroup } from "./types";
import { storageGroupMatchesSearch, matchesSearch } from "./utils";
import { ElementMenu } from "./ElementMenu";
import { CellGroupItem } from "./CellGroupItem";

interface StorageGroupItemProps {
  item: StorageGroup;
  level?: number;
  searchQuery: string;
  isLast?: boolean;
  onAddChild?: (storageGroupId: string) => void;
}

export const StorageGroupItem = ({
  item,
  level = 0,
  searchQuery,
  isLast = false,
  onAddChild,
}: StorageGroupItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasMatchingChildren = storageGroupMatchesSearch(item, searchQuery);
  const isExactMatch = matchesSearch(item, searchQuery);
  const shouldShow = !searchQuery || hasMatchingChildren;
  const highlightClass = searchQuery && isExactMatch ? "bg-yellow-50" : "bg-gray-50/50";

  if (!shouldShow) return null;

  // Filter visible children based on search
  const visibleChildren = item.children.filter(child => {
    if (child.type === "cellGroup") {
      return !searchQuery || matchesSearch(child, searchQuery);
    } else {
      return !searchQuery || storageGroupMatchesSearch(child, searchQuery);
    }
  });

  return (
    <div className={`pl-8 relative ${!isLast ? 'mb-2' : ''}`}>
      {level > 0 && (
        <>
          {/* Vertical line connecting to parent */}
          <div className={`absolute left-4 -top-2 w-px bg-gray-300 ${isLast ? 'h-[2.25rem]' : 'h-[calc(100%+0.5rem)]'}`}></div>

          {/* Horizontal line connecting to vertical line */}
          <div className="absolute left-4 top-[1.75rem] w-4 h-px bg-gray-300"></div>
        </>
      )}

      <div className={`py-2 rounded-lg ${highlightClass} border border-gray-200`}>
        <div className="flex items-center group px-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          <div className="w-6 flex items-center justify-center">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <Link
            href={item.link}
            className="flex-1 flex items-center hover:underline"
          >
            <div className="ml-2">
              <div className="flex items-center">
                <span className="text-sm">{item.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({item.shortName})
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </Link>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            {onAddChild && (
              <button
                onClick={() => onAddChild(item.id)}
                className="mr-2 p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <ElementMenu />
          </div>
        </div>
      </div>

      {isExpanded && visibleChildren.length > 0 && (
        <div className="mt-2">
          {item.children.map((child, index) => {
            // Check if the child should be visible
            const childShouldShow = child.type === "cellGroup"
              ? (!searchQuery || matchesSearch(child, searchQuery))
              : (!searchQuery || storageGroupMatchesSearch(child, searchQuery));

            if (!childShouldShow) return null;

            // Find the index among visible children
            const visibleIndex = visibleChildren.findIndex(vc => vc.id === child.id);
            const isLastVisible = visibleIndex === visibleChildren.length - 1;

            if (child.type === "cellGroup") {
              return (
                <CellGroupItem
                  key={child.id}
                  item={child}
                  searchQuery={searchQuery}
                  isLast={isLastVisible}
                />
              );
            } else {
              return (
                <StorageGroupItem
                  key={child.id}
                  item={child}
                  level={level + 1}
                  searchQuery={searchQuery}
                  isLast={isLastVisible}
                  onAddChild={onAddChild}
                />
              );
            }
          })}
        </div>
      )}
    </div>
  );
}; 