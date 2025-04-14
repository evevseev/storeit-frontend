import WarehouseStructure from "@/components/warehouse-structure";
import { PageMetadata } from "@/components/header/page-metadata";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function StoragePage() {
  return (
    <>
      <PageMetadata
        title="Структура склада"
        breadcrumbs={[{ label: "Хранение" }]}
        actions={[
          <Button className="whitespace-nowrap" variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Создать Подразделение
          </Button>,
        ]}
      />
      <WarehouseStructure />
    </>
  );
}
