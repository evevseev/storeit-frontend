import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface GroupInfoProps {
  id: string;
  description: string;
  locationPath: { label: string; href?: string }[];
  cellsCount: number;
  skuCount: number;
  createdAt: Date;
}

export default function GroupInfoCard({
  id,
  description,
  locationPath,
  cellsCount,
  skuCount,
  createdAt,
}: GroupInfoProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Информация о группе</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <div className="font-medium mb-1">Описание</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>

        <div>
          <div className="font-medium mb-1">Месторасположение</div>
          <Breadcrumb>
            <BreadcrumbList>
              {locationPath.map((item, index) => (
                <>
                  <BreadcrumbItem key={index}>
                    {item.href ? (
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </BreadcrumbItem>
                  {index < locationPath.length - 1 && <BreadcrumbSeparator />}
                </>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="font-medium mb-1">Количество ячеек</div>
            <div className="text-2xl">{cellsCount}</div>
          </div>
          <div>
            <div className="font-medium mb-1">Количество SKU</div>
            <div className="text-2xl">{skuCount}</div>
          </div>
          <div>
            <div className="font-medium mb-1">Дата создания</div>
            <div className="text-sm text-muted-foreground">
              {createdAt.toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
