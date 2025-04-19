import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PathItem {
  id: string;
  name: string;
}

interface PathBreadcrumbProps {
  path: PathItem[];
  maxVisibleItems?: number;
}

export function PathBreadcrumb({
  path,
  maxVisibleItems = 3,
}: PathBreadcrumbProps) {
  const showFullPath = path.length <= maxVisibleItems;
  const visibleItems = showFullPath ? path : [path[0], path[path.length - 1]];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {visibleItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <BreadcrumbItem>
              {index === 1 && !showFullPath && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <BreadcrumbEllipsis className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {path.slice(1, -1).map((hiddenItem) => (
                        <DropdownMenuItem key={hiddenItem.id}>
                          {hiddenItem.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <BreadcrumbSeparator></BreadcrumbSeparator>
                </>
              )}
              <BreadcrumbPage>{item.name}</BreadcrumbPage>
            </BreadcrumbItem>
            {index < visibleItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
