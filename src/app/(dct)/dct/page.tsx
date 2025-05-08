"use client";

import { ClipboardList, Package, Plus, Search } from "lucide-react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApiQueryClient } from "@/hooks/use-api-query-client";

import { DctButton } from "@/components/dct/button";
import { ScannerDialog } from "@/app/(dct)/dct/scanner/scanner-dialog";
import { ScannerResult } from "@/app/(dct)/dct/scanner/scanner";

export default function DctPage() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const router = useRouter();
  const client = useApiQueryClient();
  const { data: items } = client.useQuery("get", "/items");

  const findItemByEan = useCallback(
    (ean: string) => {
      if (!items || !items.data) return null;

      const item = items.data.find((item) =>
        item.variants.some(
          (variant) => variant.ean13 && String(variant.ean13) === ean
        )
      );
      if (item) {
        return item.id;
      }

      return null;
    },
    [items]
  );

  function handleScanResult(result: ScannerResult) {
    if (result.source === "ean") {
      const itemId = findItemByEan(result.value);
      if (itemId) {
        router.push(`/items/${itemId}`);
      }
    } else {
      router.push(result.value);
    }
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <DctButton onClick={() => setScannerOpen(true)}>
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

      <ScannerDialog
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onScan={handleScanResult}
      />
    </div>
  );
}
