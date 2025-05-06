"use client";

import WarehouseStructure from "@/components/warehouse-structure";
import { PageMetadata } from "@/components/header/page-metadata";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StoragePage() {
  return (
    <>
      <PageMetadata
        title="Структура склада"
        breadcrumbs={[{ label: "Хранение" }]}
        actions={[
          <Button asChild className="whitespace-nowrap" variant="default">
            <Link href="/units">Управление Подразделениями</Link>
          </Button>,
        ]}
      />
      <WarehouseStructure />
    </>
  );
}
