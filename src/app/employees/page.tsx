import { Employee, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Metadata } from "next";
import { PageMetadata } from "@/components/header/page-metadata";

// This would typically come from your API
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
  // Add more sample data as needed
];

export default function EmployeesPage() {
  return (
    <div className="container mx-auto">
      <PageMetadata
        title="Сотрудники"
        breadcrumbs={[
          { label: "Организация", href: "/organization" },
          { label: "Сотрудники" },
        ]}
      />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
