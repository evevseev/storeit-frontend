import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Поиск по структуре склада..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 pr-8 w-full"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 