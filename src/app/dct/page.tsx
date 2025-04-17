import { Plus } from "lucide-react";

import { DctButton } from "@/components/dct/button";
import { Button } from "@/components/ui/button";
import { ClipboardList, Package, Search } from "lucide-react";

export default function DctPage() {
  return (
    <div className="flex flex-col w-full p-5 gap-4">
      <DctButton href="/dct/item-search">
        <Search />
        Поиск товара
      </DctButton>
      <DctButton href="/dct/search" className="bg-blue-500 hover:bg-blue-600">
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
      <DctButton
        href="/dct/movement"
        className="bg-green-500 hover:bg-green-600"
      >
        <Plus />
        Оприходование
      </DctButton>
      <DctButton
        href="/dct/movement"
        className="bg-green-500 hover:bg-green-600"
      >
        <Package />
        Инвентаризация ячейки
      </DctButton>
    </div>
  );
}
