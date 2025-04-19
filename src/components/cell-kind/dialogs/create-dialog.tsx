import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm } from "@/components/common-form";
import { BlockTitle } from "@/components/common-form/block-title";

const createCellKindFormSchema = z.interface({
  name: z.string().min(1),
  description: z.string(),
  height: z.number().int().gte(1),
  width: z.number().int().gte(1),
  depth: z.number().int().gte(1),
  maxWeight: z.number().gt(0),
});

type CreateCellKindData = z.infer<typeof createCellKindFormSchema>;

interface CreateCellKindDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateCellKindData) => void;
}

export function CreateCellKindDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateCellKindDialogProps) {
  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      height: "",
      width: "",
      depth: "",
      maxWeight: "",
    },
    validators: {
      //   onChange: createCellKindFormSchema,
    },
    onSubmit: (values) => {
      //   const transformed = createCellKindSchema.parse(values.value);
      //   onSubmit(transformed);
      //   onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Новый тип ячейки</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 py-4">
            <div>
              <form.AppField
                name="name"
                children={(field) => <field.TextField placeholder="Название" />}
              />
            </div>
            <div>
              <form.AppField
                name="description"
                children={(field) => <field.TextField placeholder="Описание" />}
              />
            </div>
            <BlockTitle title="Параметры" />
            <div className="grid grid-cols-3 gap-4">
              <form.AppField
                name="height"
                children={(field) => (
                  <field.TextField
                    type="number"
                    placeholder="Высота"
                    unit="см"
                  />
                )}
              />
              <form.AppField
                name="width"
                children={(field) => (
                  <field.TextField
                    type="number"
                    placeholder="Ширина"
                    unit="см"
                  />
                )}
              />
              <form.AppField
                name="depth"
                children={(field) => (
                  <field.TextField
                    type="number"
                    placeholder="Глубина"
                    unit="см"
                  />
                )}
              />
            </div>
            <div>
              <form.AppField
                name="maxWeight"
                children={(field) => (
                  <field.TextField
                    type="number"
                    placeholder="Максимальный вес"
                    unit="кг"
                  />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <form.AppForm>
              <form.SubmitButton label="Создать" />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
