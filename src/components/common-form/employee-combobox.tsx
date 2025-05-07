import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFieldContext } from "@/components/common-form";

interface Employee {
  userId: string;
  firstName: string;
  lastName: string;
}

interface EmployeeComboboxProps {
  employees: Employee[];
  label: string;
  placeholder?: string;
}

export function EmployeeCombobox({ employees, label, placeholder }: EmployeeComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const field = useFieldContext<string | null>();

  const selectedEmployee = employees.find((emp) => emp.userId === field.state.value);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedEmployee
                  ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                  : placeholder || "Выберите сотрудника..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Поиск сотрудника..." />
                <CommandList>
                  <CommandEmpty>Сотрудник не найден.</CommandEmpty>
                  <CommandGroup>
                    {employees.map((employee) => (
                      <CommandItem
                        key={employee.userId}
                        value={employee.userId}
                        onSelect={(currentValue) => {
                          field.handleChange(currentValue === field.state.value ? null : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.state.value === employee.userId ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {`${employee.firstName} ${employee.lastName}`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {field.state.value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => field.handleChange(null)}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {field.state.meta.errors.length > 0 && (
        <div className="text-sm text-red-500">
          {field.state.meta.errors.join(", ")}
        </div>
      )}
    </div>
  );
} 