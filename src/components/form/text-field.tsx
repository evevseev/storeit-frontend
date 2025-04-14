import { useFieldContext } from "@/components/form";
import { Input } from "../ui/input";

export function TextField({ placeholder }: { placeholder: string }) {
  const field = useFieldContext<string>();

  return (
    <Input
      value={field.state.value}
      placeholder={placeholder}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
    />
  );
}
