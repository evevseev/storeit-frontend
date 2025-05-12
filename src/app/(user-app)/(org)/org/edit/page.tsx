"use client";
import { useAppForm } from "@/components/common-form";
import { PageMetadata } from "@/components/header/page-metadata";
import { BlockedPage, Block } from "@/components/common-page/block";
import { useAuth } from "@/hooks/use-auth";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const validator = z.interface({
  name: z.string().min(1),
});

export default function OrgEditPage() {
  const globalClient = useQueryClient();
  const client = useApiQueryClient();
  const router = useRouter();
  const { getOrganizationId } = useAuth();

  const mutation = client.useMutation("put", "/orgs/{id}");
  const { data: org, isPending } = client.useQuery("get", "/orgs/{id}", {
    params: {
      path: {
        id: getOrganizationId(),
      },
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: org?.data.name ?? "",
    },
    validators: {
      onChange: validator,
    },
    onSubmit: (data) => {
      mutation.mutate(
        {
          params: {
            path: {
              id: getOrganizationId(),
            },
          },
          body: {
            name: data.value.name,
          },
        },
        {
          onSuccess: () => {
            toast.success("Организация успешно обновлена");
            globalClient.invalidateQueries({ queryKey: ["get", "/orgs/{id}"] });
            router.push("/org");
          },
          onError: () => {
            toast.error("Ошибка при обновлении организации");
          },
        }
      );
    },
  });

  return (
    <BlockedPage>
      <PageMetadata
        title={`${org?.data.name}`}
        breadcrumbs={[
          { label: "Организация", href: "/org" },
          { label: "Редактирование", href: "/org/edit" },
        ]}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Block title="Редактирование организации" isLoading={isPending}>
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField label="Название" placeholder={org?.data.name} />
            )}
          />
          <form.AppForm>
            <form.SubmitButton label="Сохранить" />
          </form.AppForm>
        </Block>
      </form>
    </BlockedPage>
  );
}
