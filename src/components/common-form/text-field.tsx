import { useFieldContext } from "@/components/common-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ValidationErrorText } from "./validation-error-text";

interface TextFieldProps {
  placeholder?: string;
  type?: "text" | "number" | "nullabletext";
  unit?: string;
  label: string;
  value?: string | number | null;
  actionButton?: React.ReactNode;
}

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownFieldProps {
  label: string;
  options: DropdownOption[];
  placeholder?: string;
}

export function FormInputDropdown({
  label,
  options,
  placeholder,
}: DropdownFieldProps) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className="relative group">
        <Select
          value={field.state.value}
          onValueChange={(value) => {
            if (options.some((option) => option.value === value)) {
              field.handleChange(value);
            }
          }}
          onOpenChange={() => field.handleBlur()}
        >
          <SelectTrigger
            className={cn(
              "w-full",
              hasError ? "border-red-500 focus:border-red-500" : ""
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError && <ValidationErrorText errors={field.state.meta.errors} />}
      </div>
    </div>
  );
}

export function FormInputField({
  placeholder,
  type = "text",
  unit,
  label,
  value,
  actionButton,
}: TextFieldProps) {
  const field = useFieldContext<string | number | null>();
  const hasError = field.state.meta.errors.length > 0;

  React.useEffect(() => {
    if (value !== undefined && field.state.value === undefined) {
      field.handleChange(value);
    }
  }, [value, field]);

  const handleChange = (value: string) => {
    if (type === "number") {
      const numValue = value === "" ? "" : Number(value);
      field.handleChange(numValue);
    } else if (type === "nullabletext") {
      field.handleChange(value === "" ? null : value);
    } else {
      field.handleChange(value);
    }
  };
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className="relative group">
        <div className="flex items-center gap-2">
          <Input
            type={type}
            value={field.state.value ?? ""}
            placeholder={placeholder}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={field.handleBlur}
            className={cn(
              unit ? "pr-8" : "",
              hasError ? "border-red-500 focus:border-red-500 border-2" : ""
            )}
          />
          {actionButton && <div className="ml-2">{actionButton}</div>}
          {unit && (
            <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
              {unit}
            </div>
          )}
        </div>
        {hasError && <ValidationErrorText errors={field.state.meta.errors} />}
      </div>
    </div>
  );
}
