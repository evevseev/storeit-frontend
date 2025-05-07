import { Button } from "@/components/ui/button";
import { useFormContext } from "@/components/common-form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useField } from "@tanstack/react-form";
import { Plus, X } from "lucide-react";

interface TaskItem {
  instanceId: string;
}

export function TaskItemsField() {
  const form = useFormContext();
  const { state, handleChange } = useField({
    name: "items",
    form,
  });
  const [newInstanceId, setNewInstanceId] = useState("");

  const handleAddInstance = () => {
    const currentItems = state.value || [];
    handleChange([
      ...currentItems,
      {
        instanceId: newInstanceId,
      },
    ]);
    setNewInstanceId("");
  };

  const handleRemoveInstance = (index: number) => {
    const currentItems = state.value || [];
    handleChange(
      currentItems.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const items = state.value || [];

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">Элементы задания</div>
      <div>
        <div className="text-sm text-muted-foreground mb-2">ID экземпляра</div>
        <div className="grid gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <form.Field
                  name={`items.${index}.instanceId`}
                  children={(field) => (
                    <div className="relative group">
                      <Input
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={field.state.meta.errors.length > 0 ? "border-red-500 focus:border-red-500 border-2" : ""}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <div className="text-sm text-red-500 mt-1">
                          {field.state.meta.errors.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveInstance(index)}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                value={newInstanceId}
                onChange={(e) => setNewInstanceId(e.target.value)}
                placeholder="Введите ID экземпляра"
              />
            </div>
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={handleAddInstance}
              disabled={!newInstanceId}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {state.meta.errors.length > 0 && (
        <div className="text-sm text-red-500">
          {state.meta.errors.join(", ")}
        </div>
      )}
    </div>
  );
} 