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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { Loader2 } from "lucide-react";

interface YandexAuthConfig {
  clientId: string;
  redirectUri: string;
  buttonConfig: {
    size: "s" | "m" | "l";
    view: "main";
    theme: "light" | "dark";
    borderRadius: string;
    icon: "ya";
  };
}

const YANDEX_AUTH_CONFIG: YandexAuthConfig = {
  clientId: "712925a705b34f5399ba6f067347266b",
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/login/oauth/redirect/yandex`,
  buttonConfig: {
    size: "s",
    view: "main",
    theme: "light",
    borderRadius: "7",
    icon: "ya",
  },
};

const useYandexAuth = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const client = useApiQueryClient();
  const router = useRouter();
  const mutation = client.useMutation("post", "/auth/oauth2/yandex");
  const { data: user, isSuccess } = client.useQuery("get", "/me", {
    enabled: mutation.isSuccess,
  });

  const isAuthenticating =
    mutation.isPending || (mutation.isSuccess && !isSuccess);

  useEffect(() => {
    if (isSuccess && user) {
      router.push("/login/select-org");
    }
  }, [isSuccess, user, router]);

  const handleAuth = async (token: string) => {
    await mutation.mutate({
      body: { access_token: token },
    });
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_APP_URL) return;

      const data = event.data;
      if (
        data.type === "token" &&
        data.payload.extraData.oauthProvider === "yandex"
      ) {
        handleAuth(data.payload.access_token);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  const initYandexAuth = () => {
    (window as any).YaAuthSuggest.init(
      {
        client_id: YANDEX_AUTH_CONFIG.clientId,
        response_type: "token",
        redirect_uri: YANDEX_AUTH_CONFIG.redirectUri,
      },
      process.env.NEXT_PUBLIC_APP_URL,
      {
        view: "button",
        parentId: "yandex-id-button",
        buttonSize: YANDEX_AUTH_CONFIG.buttonConfig.size,
        buttonView: YANDEX_AUTH_CONFIG.buttonConfig.view,
        buttonTheme: YANDEX_AUTH_CONFIG.buttonConfig.theme,
        buttonBorderRadius: YANDEX_AUTH_CONFIG.buttonConfig.borderRadius,
        buttonIcon: YANDEX_AUTH_CONFIG.buttonConfig.icon,
      }
    )
      .then(({ handler }: { handler: () => void }) => {
        setIsLoaded(true);
        handler();
      })
      .catch((error: Error) => {
        console.error("Yandex Auth Error:", error);
      });
  };

  return { isLoaded, initYandexAuth, isAuthenticating };
};

const PrivacyNotice = () => (
  <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
    Нажимая продолжить, вы соглашаетесь с нашими{" "}
    <a href="#">Условиями использования</a> и{" "}
    <a href="#">Политикой конфиденциальности</a>.
  </div>
);

export function LoginForm({ className }: React.ComponentProps<"div">) {
  const { isLoaded, initYandexAuth, isAuthenticating } = useYandexAuth();

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
                  onReady={initYandexAuth}
                  onError={(error) =>
                    console.error("Script loading error:", error)
                  }
                />
                {!isLoaded && <Skeleton className="w-full h-[40px]" />}
                <div
                  id="yandex-id-button"
                  className={cn(!isLoaded && "hidden")}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <PrivacyNotice />
    </div>
  );
}
