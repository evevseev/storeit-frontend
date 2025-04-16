import { useFieldContext } from "@/components/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface TextFieldProps {
  placeholder: string;
  type?: "text" | "number";
  unit?: string;
}

export function TextField({
  placeholder,
  type = "text",
  unit,
}: TextFieldProps) {
  const field = useFieldContext<string | number>();
  const hasError = field.state.meta.errors.length > 0;
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    setErrorText(
      field.state.meta.errors.map((error) => error.message).join(", ")
    );
  }, [field.state.meta.errors]);

  const handleChange = (value: string) => {
    if (type === "number") {
      const numValue = value === "" ? "" : Number(value);
      field.handleChange(numValue);
    } else {
      field.handleChange(value);
    }
  };
  return (
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
      {errorText && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
          <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm whitespace-nowrap shadow-sm">
            {errorText}
          </div>
          <div className="w-2 h-2 bg-red-500 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
        </div>
      )}
    </div>
  );
}
