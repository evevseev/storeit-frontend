"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Search,
  Settings,
  X,
  Plus,
  Grid3X3,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define types for our warehouse structure
type ElementBase = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  link: string;
};

type CellGroup = ElementBase & {
  type: "cellGroup";
};

type StorageGroup = ElementBase & {
  type: "storageGroup";
  children: (StorageGroup | CellGroup)[];
};

type OrganizationUnit = ElementBase & {
  type: "organizationUnit";
  children: StorageGroup[];
};

type WarehouseData = OrganizationUnit[];

// Sample data
const warehouseData: WarehouseData = [
  {
    id: "org1",
    type: "organizationUnit",
    name: "North America Distribution",
    shortName: "NAD",
    description: "Main distribution center for North America",
    link: "/organization/org1",
    children: [
      {
        id: "sg1",
        type: "storageGroup",
        name: "East Coast Storage",
        shortName: "ECS",
        description: "Storage facilities for east coast distribution",
        link: "/storage-group/sg1",
        children: [
          {
            id: "sg3",
            type: "storageGroup",
            name: "Northeast Region",
            shortName: "NER",
            description: "Storage for northeast states",
            link: "/storage-group/sg3",
            children: [
              {
                id: "cg1",
                type: "cellGroup",
                name: "New York Cell",
                shortName: "NYC",
                description: "Storage cells for New York area",
                link: "/cell-group/cg1",
              },
              {
                id: "cg2",
                type: "cellGroup",
                name: "Boston Cell",
                shortName: "BOS",
                description: "Storage cells for Boston area",
                link: "/cell-group/cg2",
              },
            ],
          },
          {
            id: "cg3",
            type: "cellGroup",
            name: "Southeast Cell",
            shortName: "SEC",
            description: "Storage cells for southeast region",
            link: "/cell-group/cg3",
          },
        ],
      },
      {
        id: "sg2",
        type: "storageGroup",
        name: "West Coast Storage",
        shortName: "WCS",
        description: "Storage facilities for west coast distribution",
        link: "/storage-group/sg2",
        children: [
          {
            id: "cg4",
            type: "cellGroup",
            name: "California Cell",
            shortName: "CAL",
            description: "Storage cells for California area",
            link: "/cell-group/cg4",
          },
          {
            id: "cg5",
            type: "cellGroup",
            name: "Washington Cell",
            shortName: "WAS",
            description: "Storage cells for Washington area",
            link: "/cell-group/cg5",
          },
        ],
      },
    ],
  },
  {
    id: "org2",
    type: "organizationUnit",
    name: "European Distribution",
    shortName: "EUD",
    description: "Main distribution center for Europe",
    link: "/organization/org2",
    children: [
      {
        id: "sg4",
        type: "storageGroup",
        name: "Central Europe Storage",
        shortName: "CES",
        description: "Storage facilities for central Europe",
        link: "/storage-group/sg4",
        children: [
          {
            id: "cg6",
            type: "cellGroup",
            name: "Germany Cell",
            shortName: "GER",
            description: "Storage cells for Germany",
            link: "/cell-group/cg6",
          },
        ],
      },
    ],
  },
];

// Helper function to check if an element matches the search query
const matchesSearch = (item: ElementBase, searchQuery: string): boolean => {
  if (!searchQuery) return true;

  const query = searchQuery.toLowerCase();
  return (
    item.name.toLowerCase().includes(query) ||
    item.shortName.toLowerCase().includes(query)
  );
};

// Helper function to check if a storage group or any of its children match the search
const storageGroupMatchesSearch = (
  item: StorageGroup,
  searchQuery: string
): boolean => {
  if (matchesSearch(item, searchQuery)) return true;

  return item.children.some((child) => {
    if (child.type === "cellGroup") {
      return matchesSearch(child, searchQuery);
    } else {
      return storageGroupMatchesSearch(child, searchQuery);
    }
  });
};

// Helper function to check if an organization unit or any of its children match the search
const organizationUnitMatchesSearch = (
  item: OrganizationUnit,
  searchQuery: string
): boolean => {
  if (matchesSearch(item, searchQuery)) return true;

  return item.children.some((storageGroup) =>
    storageGroupMatchesSearch(storageGroup, searchQuery)
  );
};

// Element menu component
const ElementMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Cell Group component
const CellGroupItem = ({
  item,
  searchQuery,
  isLast,
}: {
  item: CellGroup;
  searchQuery: string;
  isLast: boolean;
}) => {
  const isMatch = matchesSearch(item, searchQuery);
  const highlightClass = searchQuery && isMatch ? "bg-yellow-50" : "";

  return (
    <div className={`pl-6 py-2 relative ${highlightClass}`}>
      {/* Vertical line connecting to parent */}
      <div className="absolute left-3 top-0 w-px bg-gray-300 h-full"></div>

      {/* Horizontal line connecting to vertical line */}
      <div className="absolute left-3 top-1/2 w-3 h-px bg-gray-300"></div>

      <div className="flex items-center group">
        <div className="w-6 flex items-center justify-center">
          <Grid3X3 className="h-4 w-4 text-muted-foreground" />
        </div>
        <Link
          href={item.link}
          className="flex-1 flex items-center hover:underline"
        >
          <div className="ml-2">
            <div className="flex items-center">
              <span className="text-sm">{item.name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({item.shortName})
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        </Link>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ElementMenu />
        </div>
      </div>

      {/* Close the vertical line if this is the last child */}
      {isLast && (
        <div className="absolute left-3 bottom-0 w-px bg-white h-1/2"></div>
      )}
    </div>
  );
};

// Storage Group component (recursive)
const StorageGroupItem = ({
  item,
  level = 0,
  searchQuery,
  isLast = false,
  onAddChild,
}: {
  item: StorageGroup;
  level?: number;
  searchQuery: string;
  isLast?: boolean;
  onAddChild?: (storageGroupId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isMatch = matchesSearch(item, searchQuery);
  const hasMatchingChildren = item.children.some((child) => {
    if (child.type === "cellGroup") {
      return matchesSearch(child, searchQuery);
    } else {
      return storageGroupMatchesSearch(child, searchQuery);
    }
  });

  // Auto-expand if there's a search query and this group or its children match
  const shouldExpand = searchQuery
    ? isMatch || hasMatchingChildren
    : isExpanded;

  // If there's a search query and neither this group nor its children match, don't render
  if (searchQuery && !isMatch && !hasMatchingChildren) {
    return null;
  }

  const highlightClass = searchQuery && isMatch ? "bg-yellow-50" : "";

  // Handle add button click
  const handleAddClick = () => {
    onAddChild?.(item.id);
  };

  return (
    <div className={cn("py-1 relative", level > 0 && "pl-6", highlightClass)}>
      {/* Vertical line for connecting to parent */}
      {level > 0 && (
        <>
          <div className="absolute left-3 top-0 w-px bg-gray-300 h-full"></div>
          <div className="absolute left-3 top-1/2 w-3 h-px bg-gray-300"></div>
          {isLast && (
            <div className="absolute left-3 bottom-0 w-px bg-white h-1/2"></div>
          )}
        </>
      )}

      <div className="flex items-center group">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-6 h-6 flex items-center justify-center focus:outline-none"
        >
          {shouldExpand ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <div className="mr-2">
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </div>
        <Link
          href={item.link}
          className="flex-1 flex items-center hover:underline"
        >
          <div>
            <div className="flex items-center">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({item.shortName})
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        </Link>
        {onAddChild && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 mr-2"
            onClick={handleAddClick}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        )}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ElementMenu />
        </div>
      </div>

      {shouldExpand && (
        <div className="mt-1">
          {item.children.map((child, index) => {
            const isLastChild = index === item.children.length - 1;

            if (child.type === "storageGroup") {
              return (
                <StorageGroupItem
                  key={child.id}
                  item={child}
                  level={level + 1}
                  searchQuery={searchQuery}
                  isLast={isLastChild}
                  onAddChild={onAddChild}
                />
              );
            } else {
              if (!searchQuery || matchesSearch(child, searchQuery)) {
                return (
                  <CellGroupItem
                    key={child.id}
                    item={child}
                    searchQuery={searchQuery}
                    isLast={isLastChild}
                  />
                );
              }
              return null;
            }
          })}
        </div>
      )}
    </div>
  );
};

// Organization Unit component
const OrganizationUnitItem = ({
  item,
  searchQuery,
  onAddStorageGroup,
  onAddChild,
}: {
  item: OrganizationUnit;
  searchQuery: string;
  onAddStorageGroup?: (organizationId: string) => void;
  onAddChild?: (storageGroupId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isMatch = matchesSearch(item, searchQuery);
  const hasMatchingChildren = item.children.some((storageGroup) =>
    storageGroupMatchesSearch(storageGroup, searchQuery)
  );

  // Auto-expand if there's a search query and this unit or its children match
  const shouldExpand = searchQuery
    ? isMatch || hasMatchingChildren
    : isExpanded;

  // If there's a search query and neither this unit nor its children match, don't render
  if (searchQuery && !isMatch && !hasMatchingChildren) {
    return null;
  }

  const highlightClass =
    searchQuery && isMatch ? "bg-yellow-100" : "bg-muted/50";

  // Handle add button click
  const handleAddClick = () => {
    onAddStorageGroup?.(item.id);
  };

  return (
    <div className="w-full">
      <div className={`flex items-center p-3 group ${highlightClass}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-6 h-6 flex items-center justify-center focus:outline-none"
        >
          {shouldExpand ? (
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
              <span className="text-base font-bold">{item.name}</span>
              <span className="text-sm text-muted-foreground ml-2">
                ({item.shortName})
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </Link>
        {onAddStorageGroup && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 mr-2"
            onClick={handleAddClick}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        )}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ElementMenu />
        </div>
      </div>

      {shouldExpand && (
        <div className="p-2 relative">
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

// Main component
interface WarehouseStructureProps {
  data?: WarehouseData;
  showSearch?: boolean;
  className?: string;
  onAddStorageGroup?: (organizationId: string) => void;
  onAddChild?: (storageGroupId: string) => void;
}

export default function WarehouseStructure({
  data = warehouseData,
  showSearch = true,
  className,
  onAddStorageGroup,
  onAddChild,
}: WarehouseStructureProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter the warehouse data based on the search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((org) =>
      organizationUnitMatchesSearch(org, searchQuery)
    );
  }, [searchQuery, data]);

  return (
    <div className={cn("w-full", className)}>
      {/* Search input */}
      {showSearch && (
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search by name or alias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {filteredData.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          {filteredData.map((org, index) => (
            <>
              <OrganizationUnitItem
                key={org.id}
                item={org}
                searchQuery={searchQuery}
                onAddStorageGroup={onAddStorageGroup}
                onAddChild={onAddChild}
              />
              {index < filteredData.length - 1 && <div className="border-t" />}
            </>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">No matching items found</p>
        </div>
      )}
    </div>
  );
}
