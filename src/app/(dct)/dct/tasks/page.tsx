"use client";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import type { components } from "@/lib/api/storeit";

type Task = components["schemas"]["TaskBase"];

const getStatusColor = (status: Task["status"]) => {
  const statusColors = {
    pending: "bg-yellow-500",
    in_progress: "bg-blue-500",
    awaiting_to_collect: "bg-purple-500",
    completed: "bg-green-500",
    failed: "bg-red-500",
  };
  return statusColors[status];
};

const getStatusLabel = (status: Task["status"]) => {
  const statusLabels = {
    pending: "Ожидает",
    in_progress: "В работе",
    awaiting_to_collect: "Ожидает сбора",
    completed: "Завершено",
    failed: "Ошибка",
  };
  return statusLabels[status];
};

export default function TasksPage() {
  const client = useApiQueryClient();
  const router = useRouter();
  const { data: tasks } = client.useQuery("get", "/tasks");

  const handleTaskClick = (taskId: string) => {
    router.push(`/dct/tasks/${taskId}`);
  };

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks?.data.map((task) => (
          <Card
            key={task.id}
            className="hover:bg-accent cursor-pointer transition-colors"
            onClick={() => handleTaskClick(task.id)}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-lg">{task.name}</h3>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(task.status)} text-white ml-2`}
                  >
                    {getStatusLabel(task.status)}
                  </Badge>
                </div>

                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    {task.assignedTo ? (
                      <span>
                        {task.assignedTo.firstName} {task.assignedTo.lastName}
                      </span>
                    ) : (
                      <span>Не назначено</span>
                    )}
                  </div>
                  <div>
                    {new Date(task.createdAt).toLocaleDateString("ru-RU")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
