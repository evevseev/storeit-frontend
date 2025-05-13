import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type DeleteDialogProps = {
  hideTrigger?: boolean;
  buttonLabel?: string;
  description?: string;
  onDelete: () => void;
  firstText?: string;
  secondText?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
};

export function DeleteDialog({
  hideTrigger = false,
  buttonLabel = "Удалить объект",
  onDelete,
  firstText = "Вы действительно желаете удалить объект?",
  secondText = "Это действие возможно отменить только с помощью администратора.",
  isOpen,
  setIsOpen,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {!hideTrigger && (
        <AlertDialogTrigger asChild>
          <Button variant="destructive" onClick={(e) => e.stopPropagation()}>
            <Trash />
            {buttonLabel}
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>{firstText}</AlertDialogDescription>
          <AlertDialogDescription>{secondText}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отменить</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onDelete();
              setIsOpen?.(false);
            }}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
