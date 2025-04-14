"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, X, Save, Trash2 } from "lucide-react";
import { PageMetadata } from "@/components/header/page-metadata";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  joiningDate: string;
  status: "active" | "blocked";
  avatarUrl: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  target: string;
}

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  label: string;
}

const EditableField = ({ value, onSave, label }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-9"
              />
              <Button
                variant="default"
                size="icon"
                onClick={handleSave}
                className="h-9 w-9"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="py-1.5">{value}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-9 w-9"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function EmployeePage() {
  const [employee, setEmployee] = useState<Employee>({
    id: "1",
    firstName: "Иван",
    lastName: "Иванов",
    middleName: "Иванович",
    email: "ivan.ivanov@example.com",
    joiningDate: "2024-01-01",
    status: "active",
    avatarUrl: "ИИ",
  });

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Администратор",
      description: "Полный доступ к системе",
      target: "Система",
    },
    {
      id: "2",
      name: "Менеджер склада",
      description: "Управление складскими операциями",
      target: "Склад",
    },
  ]);

  const handleDeleteRole = (roleId: string) => {
    setRoles((prev) => prev.filter((role) => role.id !== roleId));
  };

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Название роли",
    },
    {
      accessorKey: "description",
      header: "Описание",
    },
    {
      accessorKey: "target",
      header: "Цель",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteRole(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const toggleBlock = () => {
    setEmployee((prev) => ({
      ...prev,
      status: prev.status === "active" ? "blocked" : "active",
    }));
  };

  return (
    <div className="container py-6 space-y-6">
      <PageMetadata
        title={`${employee.lastName} ${employee.firstName}`}
        breadcrumbs={[
          { href: "/employees", label: "Сотрудники" },
          { label: `${employee.lastName} ${employee.firstName}` },
        ]}
        actions={[
          <Button
            variant={employee.status === "active" ? "destructive" : "default"}
            onClick={toggleBlock}
          >
            {employee.status === "active" ? "Заблокировать" : "Разблокировать"}
          </Button>,
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Информация о сотруднике</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-6">
            <Avatar className="h-24 w-24 text-2xl">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.firstName} ${employee.lastName}`}
              />
              <AvatarFallback>{employee.avatarUrl}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-muted-foreground">Статус</div>
                <Badge
                  variant={
                    employee.status === "active" ? "default" : "destructive"
                  }
                >
                  {employee.status === "active" ? "Активен" : "Заблокирован"}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div>{employee.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Дата начала работы
                </div>
                <div>{new Date(employee.joiningDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <EditableField
              label="Имя"
              value={employee.firstName}
              onSave={(value) =>
                setEmployee((prev) => ({ ...prev, firstName: value }))
              }
            />
            <EditableField
              label="Фамилия"
              value={employee.lastName}
              onSave={(value) =>
                setEmployee((prev) => ({ ...prev, lastName: value }))
              }
            />
            <EditableField
              label="Отчество"
              value={employee.middleName}
              onSave={(value) =>
                setEmployee((prev) => ({ ...prev, middleName: value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Назначенные роли</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={roles} pagination={false} />
        </CardContent>
      </Card>
    </div>
  );
}
