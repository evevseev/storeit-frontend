import { useFormContext } from "@/components/common-form";
import { Button } from "../ui/button";

export function FormSubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <Button disabled={!canSubmit || isSubmitting} type="submit">
          {label}
        </Button>
      )}
    />
  );
}
