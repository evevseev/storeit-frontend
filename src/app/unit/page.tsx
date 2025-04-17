"use client";

import { PageMetadata } from "@/components/header/page-metadata";
import { useApiQueryClient } from "@/hooks/use-api-query-client";

export default function UnitPage() {
  const queryClient = useApiQueryClient();

  const { data: units, isLoading: unitsLoading } = queryClient.useQuery(
    "get",
    "/units"
  );

  return (
    <>
      <PageMetadata
        title="Подразделения"
        breadcrumbs={[{ label: "Подразделения" }]}
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Подразделения</h1>
        </div>
        <div className="flex flex-col gap-4">
          {units?.data?.map((unit) => (
            <div key={unit.id}>{unit.name}</div>
          ))}
        </div>
      </div>
    </>
  );
}
