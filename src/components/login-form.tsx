"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Script from "next/script";
import { Skeleton } from "./ui/skeleton";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import client from "@/hooks/client";

export function LoginForm({ className }: React.ComponentProps<"div">) {
  const [yandexAuthLoaded, setYandexAuthLoaded] = useState(false);
  const router = useRouter();
  const mutation = client.useMutation("post", "/auth/oauth2/yandex");

  const handleYandexAuth = async (token: string) => {
    await mutation.mutate({
      body: {
        access_token: token,
      },
    });
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === process.env.NEXT_PUBLIC_APP_URL) {
        if (
          event.data.type === "token" &&
          event.data.payload.extraData.oauthProvider === "yandex"
        ) {
          handleYandexAuth(event.data.payload.access_token);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Добро пожаловать</CardTitle>
          <CardDescription>Войдите в свой аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <Script
                  src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js"
                  onReady={() => {
                    (window as any).YaAuthSuggest.init(
                      {
                        client_id: "712925a705b34f5399ba6f067347266b",
                        response_type: "token",
                        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/login/oauth/redirect/yandex`,
                      },
                      process.env.NEXT_PUBLIC_APP_URL,
                      {
                        view: "button",
                        parentId: "yandex-id-button",
                        buttonSize: "s",
                        buttonView: "main",
                        buttonTheme: "light",
                        buttonBorderRadius: "7",
                        buttonIcon: "ya",
                      }
                    )
                      .then(({ handler }: any) => {
                        setYandexAuthLoaded(true);
                        handler();
                      })
                      .catch((error: any) => {
                        console.error("Yandex Auth Error:", error);
                      });
                  }}
                  onError={(e: any) => {
                    console.error("Script loading error:", e);
                  }}
                />
                {!yandexAuthLoaded && <Skeleton className="w-full h-[40px]" />}

                <div
                  id="yandex-id-button"
                  className={cn(!yandexAuthLoaded && "hidden")}
                ></div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Нажимая продолжить, вы соглашаетесь с нашими{" "}
        <a href="#">Условиями использования</a> и{" "}
        <a href="#">Политикой конфиденциальности</a>.
      </div>
    </div>
  );
}
