import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface TaskCardProps {
  id: string;
  name: string;
  assignedTo: {
    firstName: string;
    lastName: string;
  } | null;
  startedAt: string | null;
  isCompleted: boolean;
}

export function TaskCard({
  id,
  name,
  assignedTo,
  startedAt,
  isCompleted,
}: TaskCardProps) {
  const [timeInProgress, setTimeInProgress] = useState<string>("");

  useEffect(() => {
    if (!startedAt || isCompleted) return;

    const calculateTime = () => {
      const start = new Date(startedAt).getTime();
      const now = new Date().getTime();
      const diff = now - start;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hoursText = hours > 0 ? `${hours} ч ` : "";
      const minutesText = minutes > 0 ? `${minutes} мин ` : "";
      const secondsText = `${seconds} сек`;

      return `${hoursText}${minutesText}${secondsText}`;
    };

    setTimeInProgress(calculateTime());
    const interval = setInterval(() => {
      setTimeInProgress(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, isCompleted]);

  return (
    <Card className="mb-4 bg-zinc-900 hover:bg-zinc-800 transition-colors border-zinc-800">
      <CardContent>
        <div className="flex gap-4">
          <div className="flex items-center justify-center bg-blue-600 text-white rounded-lg p-3 min-w-[4rem] h-fit">
            <span className="font-mono text-lg font-bold">
              {id.substring(0, 4)}
            </span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate text-white">{name}</h3>
            <div className="flex flex-col gap-1 mt-2">
              {assignedTo && (
                <p className="text-sm text-zinc-400">
                  {assignedTo.firstName} {assignedTo.lastName}
                </p>
              )}
              {!isCompleted && startedAt && (
                <p className="text-sm font-mono text-blue-400">
                  В работе: {timeInProgress}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
