"use client";

import { Employee, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { PageMetadata } from "@/components/header/page-metadata";
import { useApiQueryClient } from "@/hooks/use-api-query-client";

const data: Employee[] = [
  {
    id: "1",
    fullName: "John Doe",
    email: "john@example.com",
    status: "Administrator",
    joiningDate: "2024-01-15",
  },
  {
    id: "2",
    fullName: "Jane Smith",
    email: "jane@example.com",
    status: "Invited",
    joiningDate: "2024-02-20",
  },
  {
    id: "3",
    fullName: "Bob Johnson",
    email: "bob@example.com",
    status: "Blocked",
    joiningDate: "2024-03-01",
  },
];

export default function EmployeesPage() {
  const client = useApiQueryClient();
  const { data: items } = client.useQuery("get", "/items");
  
  return (
    <div className="container mx-auto">
      <PageMetadata
        title="Сотрудники"
        breadcrumbs={[
          { label: "Организация", href: "/organization" },
          { label: "Сотрудники" },
        ]}
      />
      {items?.data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
      {/* <DataTable columns={columns} data={data} /> */}
    </div>
  );
}
