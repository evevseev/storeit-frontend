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
  pending: "Ожидает",
  in_progress: "В работе",
  awaiting_to_collect: "Ожидает сбора",
  completed: "Завершено",
  failed: "Ошибка",
} as const;

const statusColors = {
  pending: "bg-yellow-500",
  in_progress: "bg-blue-500",
  awaiting_to_collect: "bg-purple-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
} as const;

export default function TaskPage() {
  const { id } = useParams() as { id: string };
  const [isScanning, setIsScanning] = useState(false);
  const client = useApiQueryClient();
  const queryClient = useQueryClient();

  const { data: taskData } = client.useQuery("get", "/tasks/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  const pickInstanceMutation = client.useMutation(
    "post",
    "/tasks/{id}/pick-instance"
  );

  const task = taskData?.data;

  const handleScan = async (result: {
    value: string;
    source: "ean" | "qr";
  }) => {
    try {
      await pickInstanceMutation.mutateAsync({
        params: {
          path: {
            id,
          },
        },
        body: {
          instanceId: result.value,
        },
      });
      toast.success("Товар успешно отсканирован");
      queryClient.invalidateQueries({ queryKey: ["get", "/tasks/{id}"] });
    } catch (error) {
      toast.error("Ошибка при сканировании товара");
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  const getCellPath = (cell: (typeof task.items)[number]["sourceCell"]) => {
    return cell.cellPath.map((pathItem, index) => (
      <span key={pathItem.id} className="flex items-center">
        <span className="whitespace-nowrap">{pathItem.name}</span>
        {index < cell.cellPath.length - 1 && (
          <ChevronRight className="h-4 w-4 mx-1 shrink-0" />
        )}
      </span>
    ));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4">
        {/* Task Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{task.name}</h1>
            {task.description && (
              <p className="text-gray-500 mt-1">{task.description}</p>
            )}
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
                <div className="flex items-center">
                  <span className="font-medium min-w-20">Расположение</span>
                  <div className="flex items-center flex-wrap gap-y-1">
                    {getCellPath(item.sourceCell)}
                  </div>
                </div>
                {item.targetCell && (
                  <div className="flex items-center">
                    <span className="font-medium min-w-20">
                      Целевое расположение:
                    </span>
                    <div className="flex items-center flex-wrap gap-y-1">
                      {getCellPath(item.targetCell)}
                    </div>
                  </div>
                )}
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
            disabled={task.status !== "pending"}
          >
            <Clock className="mr-2 h-5 w-5" />
            Статус: ожидает
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-green-100 hover:bg-green-200 border-green-500 text-green-700"
            disabled={task.status !== "completed"}
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
