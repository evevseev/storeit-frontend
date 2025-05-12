import Link from "next/link";
import { Grid3X3 } from "lucide-react";
import { CellGroup } from "./types";
import { matchesSearch } from "./utils";
import { ItemDropdown } from "./item-dropdown";
import { cn } from "@/lib/utils";
import { PrintLabelButton } from "./print-label-button";
import { GroupsCreationButton } from "./AddItemButton";

interface CellGroupItemProps {
  item: CellGroup;
  searchQuery: string;
  isLast: boolean;
}

export const CellGroupItem = ({
  item,
  searchQuery,
  isLast,
}: CellGroupItemProps) => {
  const isExactMatch = matchesSearch(item, searchQuery);
  const shouldShow = !searchQuery || isExactMatch;
  const highlightClass =
    searchQuery && isExactMatch ? "bg-yellow-50" : "bg-gray-50/50";

  if (!shouldShow) return null;

  return (
    <div className={`pl-8 relative ${!isLast ? "mb-2" : ""}`}>
      {/* Vertical line connecting to parent */}
      <div
        className={`absolute left-4 -top-2 w-px bg-gray-300 ${
          isLast ? "h-[2.25rem]" : "h-[calc(100%+0.5rem)]"
        }`}
      ></div>

      {/* Horizontal line connecting to vertical line */}
      <div className="absolute left-4 top-[1.75rem] w-4 h-px bg-gray-300"></div>

      <div
        className={cn("py-2 rounded-lg border border-gray-200", highlightClass)}
      >
        <div className="flex items-center group px-2">
          <div className="w-6 flex items-center justify-center">
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <Link
            href={`/cells-groups/${item.id}`}
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
                  url: `https://store-it.ru/cells-groups/${item.id}`,
                  name: item.alias,
                  description: `Группа ячеек\n${item.name}`,
                },
              ]}
            />
            <ItemDropdown type="cells-group" id={item.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
