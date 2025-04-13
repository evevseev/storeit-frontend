import Link from "next/link";
import { Grid3X3 } from "lucide-react";
import { CellGroup } from "./types";
import { matchesSearch } from "./utils";
import { ElementMenu } from "./ElementMenu";

interface CellGroupItemProps {
  item: CellGroup;
  searchQuery: string;
  isLast: boolean;
}

export const CellGroupItem = ({ item, searchQuery, isLast }: CellGroupItemProps) => {
  const isExactMatch = matchesSearch(item, searchQuery);
  const shouldShow = !searchQuery || isExactMatch;

  if (!shouldShow) return null;

  return (
    <div className={`pl-8 py-2 relative ${!isLast ? 'mb-2' : ''}`}>
      {/* Vertical line connecting to parent */}
      <div className={`absolute left-4 -top-2 w-px bg-gray-300 ${isLast ? 'h-[2.25rem]' : 'h-[calc(100%+0.5rem)]'}`}></div>

      {/* Horizontal line connecting to vertical line */}
      <div className="absolute left-4 top-[1.75rem] w-4 h-px bg-gray-300"></div>

      <div className={`flex items-center group ${isExactMatch && searchQuery ? 'bg-yellow-50 rounded-lg px-2 py-1' : ''}`}>
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
              <span className="ml-2 text-xs text-muted-foreground">
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
    </div>
  );
}; 