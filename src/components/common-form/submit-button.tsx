import { useFormContext } from "@/components/form";
import { Button } from "../ui/button";

export function SubmitButton({
  label,
  type = "submit",
}: {
  label: string;
  type?: "submit" | "button";
}) {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <Button disabled={!canSubmit || isSubmitting} type={type}>
          {label}
        </Button>
      )}
    />
  );
}
