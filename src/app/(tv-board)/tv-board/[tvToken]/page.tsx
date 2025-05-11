"use client";

import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useParams } from "next/navigation";
import { TaskCard } from "@/components/tv-board/task-card";
import { useEffect } from "react";

export default function TvBoardPage() {
  const apiClient = useApiQueryClient();
  const { tvToken } = useParams() as { tvToken: string };

  const { data: tvBoardData, refetch } = apiClient.useQuery(
    "get",
    "/tv-boards/{tvToken}/data",
    {
      params: {
        path: {
          tvToken: tvToken,
        },
      },
      refetchInterval: 5000, // Refetch every 5 seconds
    }
  );

  const inProgressTasks =
    tvBoardData?.data.tasks.filter(
      (task) => task.status === "in_progress" || task.status === "pending"
    ) || [];

  const completedTasks =
    tvBoardData?.data.tasks.filter((task) => task.status === "completed") || [];

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="container mx-auto h-screen p-4 md:p-8">
        <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* In Progress Column */}
          <div className="flex flex-col gap-6">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-2xl font-bold text-white">В работе</h2>
              <p className="text-zinc-400 mt-1">
                {inProgressTasks.length}{" "}
                {inProgressTasks.length === 1
                  ? "задание"
                  : inProgressTasks.length >= 2 && inProgressTasks.length <= 4
                  ? "задания"
                  : "заданий"}{" "}
                в работе
              </p>
            </div>
            <div className="flex-1 overflow-auto pr-2">
              <div className="grid gap-4">
                {inProgressTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    assignedTo={
                      task.assignedTo
                        ? {
                            firstName: task.assignedTo.firstName,
                            lastName: task.assignedTo.lastName,
                          }
                        : null
                    }
                    startedAt={task.createdAt}
                    isCompleted={false}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Completed Column */}
          <div className="flex flex-col gap-6">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-2xl font-bold text-white">Ожидают</h2>
              <p className="text-zinc-400 mt-1">
                {completedTasks.length}{" "}
                {completedTasks.length === 1
                  ? "задание ожидает"
                  : completedTasks.length >= 2 && completedTasks.length <= 4
                  ? "задания ожидают"
                  : "заданий ожидают"}
              </p>
            </div>
            <div className="flex-1 overflow-auto pr-2">
              <div className="grid gap-4">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    assignedTo={
                      task.assignedTo
                        ? {
                            firstName: task.assignedTo.firstName,
                            lastName: task.assignedTo.lastName,
                          }
                        : null
                    }
                    startedAt={task.createdAt}
                    isCompleted={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
