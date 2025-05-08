import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { Block, BlockTextElement } from "../common-page/block";

interface GroupInfoProps {
  id: string;
  // description: string;
  // locationPath: { label: string; href?: string }[];
  // cellsCount: number;
  // skuCount: number;
  // createdAt: Date;
}

export default function GroupInfoCard({
  id,
}: // description,
// locationPath,
// cellsCount,
// skuCount,
// createdAt,
GroupInfoProps) {
  const client = useApiQueryClient();
  const { data: group, isPending } = client.useQuery(
    "get",
    "/cells-groups/{groupId}",
    {
      params: {
        path: {
          groupId: id,
        },
      },
    }
  );

  return (
    <Block title="Информация о группе" isLoading={isPending}>
      <BlockTextElement label="Название" value={group?.data.name} />
      <BlockTextElement label="Обозначение" value={group?.data.alias} />
      <BlockTextElement label="ID" value={group?.data.id} />
      {/* <BlockTextElement label="Количество ячеек" value={group?.data.cellsCount} /> */}
    </Block>

    //     // </div>

    //     // <div>
    //     //   <div className="font-medium mb-1">Месторасположение</div>
    //     //   <Breadcrumb>
    //     //     <BreadcrumbList>
    //     //       {locationPath.map((item, index) => (
    //     //         <>
    //     //           <BreadcrumbItem key={index}>
    //     //             {item.href ? (
    //     //               <BreadcrumbLink href={item.href}>
    //     //                 {item.label}
    //     //               </BreadcrumbLink>
    //     //             ) : (
    //     //               <span>{item.label}</span>
    //     //             )}
    //     //           </BreadcrumbItem>
    //     //           {index < locationPath.length - 1 && <BreadcrumbSeparator />}
    //     //         </>
    //     //       ))}
    //     //     </BreadcrumbList>
    //     //   </Breadcrumb>
    //     // </div>

    //     <div className="grid grid-cols-3 gap-4">
    //       <div>
    //         <div className="font-medium mb-1">Количество ячеек</div>
    //         <div className="text-2xl">{cellsCount}</div>
    //       </div>
    //       <div>
    //         <div className="font-medium mb-1">Количество SKU</div>
    //         <div className="text-2xl">{skuCount}</div>
    //       </div>
    //       <div>
    //         <div className="font-medium mb-1">Дата создания</div>
    //         <div className="text-sm text-muted-foreground">
    //           {createdAt.toLocaleDateString("ru-RU", {
    //             year: "numeric",
    //             month: "long",
    //             day: "numeric",
    //           })}
    //         </div>
    //       </div>
    //     </div>
    //   </CardContent>
    // </Card>
  );
}
