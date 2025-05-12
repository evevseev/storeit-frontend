"use client";

import { PageMetadata } from "@/components/header/page-metadata";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { DataTable } from "@/components/data-table";
import { CreateUnitDialog } from "./create-unit-dialog";
import { createUnitColumns } from "./columns";

export default function UnitsPage() {
  const client = useApiQueryClient();
  const { data, isPending } = client.useQuery("get", "/units");

  const columns = createUnitColumns();

  return (
    <>
      <PageMetadata
        title="Подразделения"
        breadcrumbs={[
          { label: "Организация", href: "/org" },
          { label: "Подразделения", href: "/units" },
        ]}
        actions={[<CreateUnitDialog key="create" />]}
      />
      <DataTable
        data={data?.data ?? []}
        columns={columns}
        getRowHref={(row) => `/units/${row.id}`}
        isLoading={isPending}
      />
    </>
  );
}
