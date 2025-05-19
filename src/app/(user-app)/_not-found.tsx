"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-gray-900">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Страница не найдена
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            К сожалению, запрашиваемая страница или объект не существует
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <Button variant="default" onClick={() => router.back()}>
            Вернуться назад
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
