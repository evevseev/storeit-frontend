interface TableErrorProps {
  message?: string;
}

export function TableError({
  message = "Не удалось получить данные",
}: TableErrorProps) {
  return (
    <div className="w-full py-24 text-center text-gray-500">{message}</div>
  );
}
