"use client";
import { useAppForm } from "@/components/form";
import { PageMetadata } from "@/components/header/page-metadata";
import {
  BlockedPage,
  BlockTextElement,
  Block,
} from "@/components/common-page/block";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const validator = z.interface({
  last_name: z.string().min(1),
  first_name: z.string().min(1),
  middle_name: z.nullable(z.string()),
});

export default function ProfileEditPage() {
  const globalClient = useQueryClient();
  const client = useApiQueryClient();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const mutation = client.useMutation("put", "/me");

  const form = useAppForm({
    defaultValues: {
      last_name: user?.last_name ?? "",
      first_name: user?.first_name ?? "",
      middle_name: user?.middle_name ?? null,
    },
    validators: {
      onChange: validator,
    },
    onSubmit: async (data) => {
      await mutation.mutate(
        {
          body: {
            first_name: data.value.first_name,
            last_name: data.value.last_name,
            middle_name: data.value.middle_name,
          },
        },
        {
          onSuccess: () => {
            toast.success("Профиль успешно обновлен");
            globalClient.invalidateQueries({ queryKey: ["me"] });
            router.push("/profile");
          },
          onError: () => {
            toast.error("Ошибка при обновлении профиля");
          },
        }
      );
    },
  });

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <BlockedPage>
      <PageMetadata
        title={`${user.first_name} ${user.last_name}`}
        breadcrumbs={[
          { label: "Профиль", href: "/profile" },
          { label: "Редактирование", href: "/profile/edit" },
        ]}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Block title="Редактирование профиля">
          <form.AppField
            name="last_name"
            children={(field) => (
              <field.TextField label="Фамилия" placeholder={user?.last_name} />
            )}
          />
          <form.AppField
            name="first_name"
            children={(field) => (
              <field.TextField label="Имя" placeholder={user?.first_name} />
            )}
          />
          <form.AppField
            name="middle_name"
            children={(field) => (
              <field.TextField
                label="Отчество"
                placeholder={user?.middle_name ?? ""}
              />
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
