import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppForm } from "@/components/form";
import React from "react";

const createGroupSchema = z.interface({
  name: z.string().min(1, "Name is required"),
  alias: z.string().min(1, "Alias is required"),
  description: z.string(),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentPath: { id: string; name: string }[];
  onSubmit: (data: CreateGroupFormData) => void;
}

export function CreateGroupDialog({
  open,
  onOpenChange,
  parentPath,
}: CreateGroupDialogProps) {
  const form = useAppForm({
    defaultValues: {
      name: "",
      alias: "",
      description: "",
    },
    validators: {
      onChange: createGroupSchema,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values.value));
      onOpenChange(false);
    },
  });

  const showFullPath = parentPath.length <= 3;
  const visibleItems = showFullPath
    ? parentPath
    : [parentPath[0], parentPath[parentPath.length - 1]];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Group</DialogTitle>
          <Breadcrumb>
            <BreadcrumbList>
              {visibleItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <BreadcrumbItem>
                    {index === 1 && !showFullPath && (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center gap-1">
                            <BreadcrumbEllipsis className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {parentPath.slice(1, -1).map((hiddenItem) => (
                              <DropdownMenuItem key={hiddenItem.id}>
                                {hiddenItem.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <BreadcrumbSeparator></BreadcrumbSeparator>
                      </>
                    )}
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                  {index < visibleItems.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <form.AppField
                  name="name"
                  children={(field) => <field.TextField placeholder="Name" />}
                />
              </div>
              <div className="col-span-1">
                <form.AppField
                  name="alias"
                  children={(field) => <field.TextField placeholder="Alias" />}
                />
              </div>
            </div>
            <div>
              <form.AppField
                name="description"
                children={(field) => (
                  <field.TextField placeholder="Description" />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <form.AppForm>
              <form.SubmitButton label="Create" />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
