"use client";

import { PageMetadata } from "@/components/header/page-metadata";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { DataTable } from "@/components/data-table";
import { useState, useEffect } from "react";
import { CreateUnitDialog } from "./create-unit-dialog";
import { createUnitColumns } from "./[id]/columns";
import { Unit } from "./types";

export default function UnitsPage() {
  const client = useApiQueryClient();
  const { data, isPending } = client.useQuery("get", "/units");
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    if (data) {
      setUnits(
        data.data.map((unit) => ({
          id: unit.id,
          name: unit.name,
          alias: unit.alias,
          address: unit.address ?? "",
        }))
      );
    }
  }, [data]);

  const getRowHref = (unit: Unit) => `/units/${unit.id}`;
  const columns = createUnitColumns();

  return (
    <>
      <PageMetadata
        title="Подразделения"
        breadcrumbs={[
          { label: "Организация" },
          { label: "Подразделения", href: "/units" },
        ]}
        actions={[<CreateUnitDialog key="create" />]}
      />
      <DataTable
        data={units}
        columns={columns}
        getRowHref={getRowHref}
        isLoading={isPending}
      />
    </>
  );
}
