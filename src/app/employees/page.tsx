import { Employee, columns } from "./columns"
import { DataTable } from "./data-table"

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
]

export default function EmployeesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Employees</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
} 