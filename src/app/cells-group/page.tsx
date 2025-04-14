import WarehouseStructure from "@/components/warehouse-structure";
import { PageMetadata } from "@/components/header/page-metadata";
import CellsList from "@/components/cells-group/cells-list";
import GroupInfoCard from "@/components/cells-group/group-info-card";
// import { useParams } from "next/navigation";

export default function CellsGroupPage() {
  // const { groupId } = useParams();
  const groupId = "1";
  const breadcrumbs = [
    { label: "Хранение" },
    { label: "Москва" },
    { label: "1ый этаж" },
    { label: `Группа ячеек #${groupId}` },
  ];

  // Sample data - this should be fetched from the backend
  const groupInfo = {
    id: groupId,
    description: "Группа ячеек для хранения мелкогабаритных товаров",
    locationPath: breadcrumbs,
    cellsCount: 24,
    skuCount: 18,
    createdAt: new Date("2024-01-15"),
  };

  return (
    <>
      <PageMetadata
        title={`Группа ячеек #${groupId}`}
        breadcrumbs={breadcrumbs}
      />
      <div className="container mx-auto py-6">
        <GroupInfoCard {...groupInfo} />
        <CellsList />
      </div>
    </>
  );
}
