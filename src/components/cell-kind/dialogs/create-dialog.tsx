import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormBlockTitle, useAppForm } from "@/components/common-form";

// Выделение схемы в константу
const CELL_KIND_FORM_SCHEMA = z.object({
  name: z.string().min(1),
  description: z.string(),
  height: z.number().gte(1),
  width: z.number().gte(1),
  depth: z.number().gte(1),
  maxWeight: z.number().gt(0),
});

// Определение типа на основе схемы
type CellKindFormData = z.infer<typeof CELL_KIND_FORM_SCHEMA>;

// Начальные значения как константа
const INITIAL_FORM_VALUES: CellKindFormData = {
  name: "",
  description: "",
  height: 0,
  width: 0,
  depth: 0,
  maxWeight: 0,
};

interface CreateCellKindDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CellKindFormData) => void;
}

// Компонент для отображения измерений ячейки
const DimensionsFields = ({
  form,
}: {
  form: ReturnType<typeof useAppForm>;
}) => (
  <div className="grid grid-cols-3 gap-4">
    <form.AppField name="height">
      {(field) => (
        <field.TextField
          label="Высота"
          type="number"
          placeholder="Высота"
          unit="см"
        />
      )}
    </form.AppField>
    <form.AppField name="width">
      {(field) => (
        <field.TextField
          type="number"
          placeholder="Ширина"
          label="Ширина"
          unit="см"
        />
      )}
    </form.AppField>
    <form.AppField name="depth">
      {(field) => (
        <field.TextField
          type="number"
          placeholder="Глубина"
          label="Глубина"
          unit="см"
        />
      )}
    </form.AppField>
  </div>
);

export function CreateCellKindDialog({
  open,
  onOpenChange,
  onSubmit,
}: Readonly<CreateCellKindDialogProps>) {
  const form = useAppForm({
    defaultValues: INITIAL_FORM_VALUES,
    validators: {
      onChange: CELL_KIND_FORM_SCHEMA,
    },
    onSubmit: (values) => {
      const data = CELL_KIND_FORM_SCHEMA.parse(values.value);
      onSubmit(data);
      onOpenChange(false);
    },
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await form.handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Новый тип ячейки</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <form.AppField name="name">
                {(field) => <field.TextField label="Название" />}
              </form.AppField>
            </div>
            <div>
              <form.AppField name="description">
                {(field) => <field.TextField label="Описание" />}
              </form.AppField>
            </div>

            <FormBlockTitle title="Параметры" />
            <DimensionsFields form={form} />

            <div>
              <form.AppField name="maxWeight">
                {(field) => (
                  <field.TextField
                    type="number"
                    placeholder="Максимальный вес"
                    label="Максимальный вес"
                    unit="кг"
                  />
                )}
              </form.AppField>
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
