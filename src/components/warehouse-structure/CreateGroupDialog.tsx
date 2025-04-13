import { useForm } from "@tanstack/react-form";
// import { zodValidator } from "@tanstack/form-zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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

const createGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  alias: z.string().min(1, "Alias is required"),
  description: z.string().optional(),
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
  onSubmit,
}: CreateGroupDialogProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      alias: "",
      description: "",
    },
    onSubmit: (values) => {
    //   onSubmit(values);
      onOpenChange(false);
    },
    // validatorAdapter: zodValidator,
  });

  const showFullPath = parentPath.length <= 3;
  const visibleItems = showFullPath ? parentPath : [
    parentPath[0],
    parentPath[parentPath.length - 1]
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Group</DialogTitle>
          <Breadcrumb>
            <BreadcrumbList>
              {visibleItems.map((item, index) => (
                <BreadcrumbItem key={item.id}>
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
                      <BreadcrumbSeparator />
                    </>
                  )}
                  {index === visibleItems.length - 1 ? (
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink>{item.name}</BreadcrumbLink>
                  )}
                  {index < visibleItems.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </DialogHeader>

          <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <form.Field
                    name="name"
                    validators={{
                    //   onChange: zodValidator(createGroupSchema.shape.name),
                    }}
                    children={(field) => (
                      <Input
                        placeholder="Name"
                        // value={field.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <form.Field
                    name="alias"
                    validators={{
                    //   onChange: zodValidator(createGroupSchema.shape.alias),
                    }}
                    children={(field) => (
                      <Input
                        placeholder="Alias"
                        // value={field.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <form.Field
                  name="description"
                  children={(field) => (
                    <Input
                      placeholder="Description"
                    //   value={field.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                Create
              </Button>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  );
} 