"use client";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import type { components } from "@/lib/api/storeit";
import { useAuth } from "@/hooks/use-auth";

type Task = components["schemas"]["TaskBase"];

const getStatusColor = (status: Task["status"]) => {
  const statusColors = {
    pending: "bg-yellow-500",
    in_progress: "bg-blue-500",
    ready: "bg-purple-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
  };
  return statusColors[status];
};

const getStatusLabel = (status: Task["status"]) => {
  const statusLabels = {
    pending: "Ожидает взятие",
    in_progress: "В работе",
    ready: "Готово к выдаче",
    completed: "Завершено",
    cancelled: "Отменено",
  };
  return statusLabels[status];
};

function TaskCard({ task }: { task: Task }) {
  const router = useRouter();

  return (
    <Card
      key={task.id}
      className="hover:bg-accent cursor-pointer transition-colors"
      onClick={() => router.push(`/dct/tasks/${task.id}`)}
    >
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="text-xs text-muted-foreground font-mono">
            ID: {task.id}
          </div>
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

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
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
                {new Date(task.createdAt).toLocaleString("ru-RU", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </div>
            </div>
            {task.unit && (
              <div className="text-xs text-muted-foreground">
                Подразделение: {task.unit.name}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskGroup({ title, tasks }: { title: string; tasks: Task[] }) {
  if (tasks.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const client = useApiQueryClient();
  const { user } = useAuth();
  const { data: tasks } = client.useQuery("get", "/tasks");

  const myTasks =
    tasks?.data.filter((task) => task.assignedTo?.userId === user?.id) || [];

  const incompleteTasks =
    tasks?.data.filter(
      (task) =>
        task.status !== "completed" &&
        task.status !== "cancelled" &&
        task.assignedTo?.userId !== user?.id
    ) || [];

  if (myTasks.length === 0 && incompleteTasks.length === 0) {
    return <h1>Задания отсутствуют</h1>;
  }

  return (
    <div className="flex flex-col gap-8">
      <TaskGroup title="Задания на мне" tasks={myTasks} />
      <TaskGroup title="Невыполненные задания" tasks={incompleteTasks} />
    </div>
  );
}
