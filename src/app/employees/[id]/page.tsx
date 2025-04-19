"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, X, Save, Trash2 } from "lucide-react";
import { PageMetadata } from "@/components/header/page-metadata";
import {
  Block,
  BlockTextElement,
  BlockCustomElement,
  EditButton,
  BlockRow,
} from "@/components/common-page/block";

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
          <EditButton label="Редактировать" onClick={() => {}} />,
          <Button
            variant={employee.status === "active" ? "destructive" : "default"}
            onClick={toggleBlock}
          >
            {employee.status === "active" ? "Заблокировать" : "Разблокировать"}
          </Button>,
        ]}
      />

      <Block title="Информация о сотруднике">
        <BlockCustomElement
          label="Статус"
          value={
            <Badge
              variant={employee.status === "active" ? "default" : "destructive"}
            >
              {employee.status === "active" ? "Активен" : "Заблокирован"}
            </Badge>
          }
        />
        <BlockRow>
          <BlockTextElement label="Фамилия" value={employee.lastName} />
          <BlockTextElement label="Имя" value={employee.firstName} />
          <BlockTextElement label="Отчество" value={employee.middleName} />
        </BlockRow>
        <BlockTextElement label="Email" value={employee.email} />
        <BlockTextElement
          label="Дата присоединения"
          value={new Date(employee.joiningDate).toLocaleDateString()}
        />
      </Block>

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
