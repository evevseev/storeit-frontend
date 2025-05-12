import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { Block, BlockTextElement } from "../common-page/block";

export default function GroupInfoCard({ id }: { id: string }) {
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
      <BlockTextElement label="ID" value={group?.data.id} copyable />
      <BlockTextElement label="Название" value={group?.data.name} />
      <BlockTextElement label="Обозначение" value={group?.data.alias} />
    </Block>
  );
}
