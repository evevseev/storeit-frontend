import { useFieldContext } from "@/components/common-form";
import { VariantTable, Variant } from "./variant-table";

export function VariantField() {
  const field = useFieldContext<Variant[]>();

  return (
    <VariantTable value={field.state.value} onChange={field.handleChange} />
  );
}
