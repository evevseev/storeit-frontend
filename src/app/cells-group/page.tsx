import WarehouseStructure from "@/components/warehouse-structure";
import { PageMetadata } from "@/components/header/page-metadata";
import CellsList from "@/components/cells-group/cells-list";
// import { useParams } from "next/navigation";

export default function CellsGroupPage() {
  // const { groupId } = useParams();
  const groupId = "1";
  return (
    <>
      <PageMetadata
        title={`Группа ячеек #${groupId}`}
        breadcrumbs={[
          { label: "Хранение" },
          { label: "Москва" },
          { label: "1ый этаж" },
          { label: `Группа ячеек #${groupId}` },
        ]}
      />
      <div className="container mx-auto py-6">
        <CellsList />
      </div>
    </>
  );
}
