import { useFieldContext } from "@/components/common-form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import React from "react";

interface TextFieldProps {
  placeholder?: string;
  type?: "text" | "number";
  unit?: string;
  label: string;
  value?: string | number;
}

export function FormInputField({
  placeholder,
  type = "text",
  unit,
  label,
  value,
}: TextFieldProps) {
  const field = useFieldContext<string | number>();
  const hasError = field.state.meta.errors.length > 0;

  const handleChange = (value: string) => {
    if (type === "number") {
      const numValue = value === "" ? "" : Number(value);
      field.handleChange(numValue);
    } else {
      field.handleChange(value);
    }
  };
  // {field.state.meta.errors.length > 0 ? (
  //   <em role="alert">{field.state.meta.errors.join(', ')}</em>
  // ) : null}
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className="relative group">
        <Input
          type={type}
          value={field.state.value}
          placeholder={placeholder}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className={cn(
            unit ? "pr-8" : "",
            hasError ? "border-red-500 focus:border-red-500" : ""
          )}
        />
        {unit && (
          <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
            {unit}
          </div>
        )}
        {hasError && (
          <div className="absolute -top-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
            <div className="bg-red-500 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
              {field.state.meta.errors.join(", ")}
            </div>
            <div className="w-2 h-2 bg-red-500 rotate-45 translate-x-2 -translate-y-1"></div>
          </div>
        )}
      </div>
    </div>
  );
}
