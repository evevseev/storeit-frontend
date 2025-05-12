import { ClipboardList, Package, Plus, Search } from "lucide-react";

import { DctButton } from "@/components/dct/button";

export default function DctPage() {
  return (
    <div className="flex flex-col w-full p-5 gap-4">
      <DctButton href="/dct/scanner">
        <Search />
        Поиск товара / Ячейки / Экземпляра
      </DctButton>
      <DctButton href="/dct/tasks" className="bg-blue-500 hover:bg-blue-600">
        <ClipboardList />
        Задания
      </DctButton>
      <DctButton
        href="/dct/movement"
        className="bg-green-500 hover:bg-green-600"
      >
        <Package />
        Перемещения
      </DctButton>
      <DctButton href="/items" className="bg-green-500 hover:bg-green-600">
        <Plus />
        Товары
      </DctButton>
      <DctButton href="/storage" className="bg-green-500 hover:bg-green-600">
        <Package />
        Структура склада
      </DctButton>
    </div>
  );
}
