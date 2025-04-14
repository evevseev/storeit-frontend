import { useFieldContext } from "@/components/form";
import { Input } from "../ui/input";

interface TextFieldProps {
  placeholder: string;
  type?: "text" | "number";
  unit?: string;
}

export function TextField({ placeholder, type = "text", unit }: TextFieldProps) {
  const field = useFieldContext<string | number>();

  const handleChange = (value: string) => {
    if (type === "number") {
      const numValue = value === "" ? "" : Number(value);
      field.handleChange(numValue);
    } else {
      field.handleChange(value);
    }
  };

  return (
    <div className="relative">
      <Input
        type={type}
        value={field.state.value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className={unit ? "pr-8" : undefined}
      />
      {unit && (
        <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
          {unit}
        </div>
      )}
    </div>
  );
}
