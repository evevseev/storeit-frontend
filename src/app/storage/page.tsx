import WarehouseStructure from "@/components/warehouse-structure";
import { PageMetadata } from "@/components/header/page-metadata";

export default function StoragePage() {
  return (
    <>
      <PageMetadata
        title="Структура склада"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Storage" }]}
      />
      <WarehouseStructure />
    </>
  );
}
