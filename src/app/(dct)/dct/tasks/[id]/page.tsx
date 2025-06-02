"use client";

import { useParams } from "next/navigation";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Barcode, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ScannerDialog } from "./scanner-dialog";
import { CopyableText } from "@/components/ui/copyable-text";

const statusLabels = {
  pending: "Ожидает сборки",
  in_progress: "В работе",
  ready: "Ожидает выдачи",
  completed: "Завершено",
  cancelled: "Отменено",
} as const;

const statusColors = {
  pending: "bg-yellow-500",
  in_progress: "bg-blue-500",
  ready: "bg-purple-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
} as const;

export default function TaskPage() {
  const { id } = useParams() as { id: string };
  const [isScanning, setIsScanning] = useState(false);
  const client = useApiQueryClient();
  const queryClient = useQueryClient();

  const { data: taskData, refetch: refetchTask } = client.useQuery(
    "get",
    "/tasks/{id}",
    {
      params: {
        path: {
          id,
        },
      },
    }
  );

  const pickInstanceMutation = client.useMutation(
    "post",
    "/tasks/{id}/pick-instance"
  );

  const markTaskAsReadyMutation = client.useMutation(
    "post",
    "/tasks/{id}/awaiting"
  );

  const markTaskAsCompletedMutation = client.useMutation(
    "post",
    "/tasks/{id}/done"
  );

  const task = taskData?.data;

  const handleTaskReady = async () => {
    try {
      await markTaskAsReadyMutation.mutateAsync({
        params: {
          path: {
            id,
          },
        },
      });
      toast.success("Задача успешно отмечена как ожидаемая");
      await refetchTask();
    } catch (error) {
      toast.error("Ошибка при отметке задачи как ожидаемой");
    }
  };

  const handleTaskCompleted = async () => {
    try {
      await markTaskAsCompletedMutation.mutateAsync({
        params: {
          path: {
            id,
          },
        },
      });
      toast.success("Задача успешно отмечена как выполненная");
      await refetchTask();
    } catch (error) {
      toast.error("Ошибка при отметке задачи как выполненной");
    }
  };

  const handlePickInstance = async (instanceId: string) => {
    try {
      await pickInstanceMutation.mutateAsync({
        params: {
          path: {
            id,
          },
        },
        body: {
          instanceId,
        },
      });
      toast.success("Товар успешно отмечен как подобранный");
      await refetchTask();
    } catch (error) {
      toast.error("Ошибка при отметке товара как подобранного");
    }
  };

  const handleScan = async (result: {
    value: string;
    source: "ean" | "qr";
  }) => {
    if (result.source === "ean") {
      return;
    }
    const instanceId = result.value.split("/").pop();
    if (instanceId) {
      handlePickInstance(instanceId);
    }
  };

  if (!task) {
    return <div>Загрузка...</div>;
  }

  const getCellPath = (cell: (typeof task.items)[number]["sourceCell"]) => {
    return (
      <div className="space-y-2">
        <div>
          <div className="font-semibold text-foreground mb-1">Путь:</div>
          <div className="flex items-center flex-wrap gap-y-1 text-sm text-muted-foreground">
            {cell.cellPath.map((pathItem, index) => (
              <span key={pathItem.id} className="flex items-center">
                <span className="whitespace-nowrap">
                  {pathItem.name} ({pathItem.alias})
                </span>
                {index < cell.cellPath.length - 1 && (
                  <ChevronRight className="h-4 w-4 mx-1 shrink-0" />
                )}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold text-foreground mb-1">Ячейка:</div>
          <div className="text-base font-semibold">
            Ряд {cell.row}, Уровень {cell.level}, Место {cell.position} (
            {cell.alias})
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4">
        {/* Task Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{task.name}</h1>
            {task.description && (
              <p className="text-gray-500 mt-1">{task.description}</p>
            )}
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {task.unit && <p>Подразделение: {task.unit.name}</p>}
              <p>
                Создано:{" "}
                {new Date(task.createdAt).toLocaleString("ru-RU", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
                {task.assignedTo && (
                  <>
                    {" "}
                    • Исполнитель: {task.assignedTo.firstName}{" "}
                    {task.assignedTo.lastName}
                  </>
                )}
              </p>
              {task.completedAt && (
                <p>
                  Завершено:{" "}
                  {new Date(task.completedAt).toLocaleString("ru-RU", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${statusColors[task.status]} text-white`}
          >
            {statusLabels[task.status]}
          </Badge>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Товары для подбора</h2>
          {task.items.map((item) => (
            <div
              key={item.instance.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">{item.instance.item.name}</span>
                  <div className="flex gap-3 text-sm text-gray-500">
                    {item.instance.variant.ean13 && (
                      <span>
                        EAN:{" "}
                        <CopyableText>
                          {item.instance.variant.ean13}
                        </CopyableText>
                      </span>
                    )}
                    {item.instance.variant.article && (
                      <span>
                        Артикул:{" "}
                        <CopyableText>
                          {item.instance.variant.article}
                        </CopyableText>
                      </span>
                    )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    item.status === "picked"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }
                >
                  {item.status === "picked" ? "Подобран" : "Ожидает"}
                </Badge>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <div>{getCellPath(item.sourceCell)}</div>
                {item.targetCell && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium min-w-20">
                      Целевое расположение:{" "}
                    </span>
                    {getCellPath(item.targetCell)}
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-100 hover:bg-green-200 border-green-500 text-green-700"
                  disabled={item.status === "picked"}
                  onClick={() => handlePickInstance(item.instance.id)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Отметить как подобранный
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status and Scanner Buttons */}
      <div className="p-4 border-t space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            className="bg-yellow-100 hover:bg-yellow-200 border-yellow-500 text-yellow-700"
            disabled={task.status === "ready"}
            onClick={() => handleTaskReady()}
          >
            <Clock className="mr-2 h-5 w-5" />
            Статус: готов
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-green-100 hover:bg-green-200 border-green-500 text-green-700"
            disabled={task.status === "completed"}
            onClick={() => handleTaskCompleted()}
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Статус: выполнен
          </Button>
        </div>
        <Button
          className="w-full py-8 text-lg font-semibold"
          size="lg"
          onClick={() => setIsScanning(true)}
          disabled={task.status === "completed" || task.status === "failed"}
        >
          <Barcode className="mr-3 h-6 w-6" />
          Сканировать товар
        </Button>
      </div>

      <ScannerDialog
        open={isScanning}
        onOpenChange={setIsScanning}
        onScan={handleScan}
      />
    </div>
  );
}
