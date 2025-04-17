"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import Script from "next/script";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // useEffect(() => {
  //   // создаём тег <script>
  //   // const script = document.createElement("script");
  //   // script.src =
  //   //   "https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js";
  //   // script.async = true;

  //   // // после загрузки можно инициализировать библиотеку
  //   // script.onload = () => {
  //   //   if ((window as any).YaAuthSuggest) {
  //   //     (window as any).YaAuthSuggest.init(
  //   //       {
  //   //         client_id: "712925a705b34f5399ba6f067347266b",
  //   //         response_type: "token",
  //   //         redirect_uri: "https://localhost:3000/auth/oauth/yandex",
  //   //       },
  //   //       "https://localhost",
  //   //       { view: "default" }
  //   //     )
  //   //       .then(({ handler }: any) => handler())
  //   //       .then((data: any) => console.log("Сообщение с токеном", data))
  //   //       .catch((error: any) => console.log("Обработка ошибки", error));
  //   //   }
  //   // };

  //   document.body.appendChild(script);

  //   // чистим за собой при размонтировании
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []); // пустой массив — скрипт подключается один раз при монтировании
  // // return <div>Hello</div>;
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Script
                  src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js"
                  // onReady={() => {
                  //   console.log("ready");
                  //   console.log(window.YaAuthSuggest)
                  //   window.YaAuthSuggest.init(
                  //     {
                  //       client_id: "712925a705b34f5399ba6f067347266b",
                  //       response_type: "token",
                  //       redirect_uri: "https://storeit-frontend-git-main-evevseevs-projects-fd07aed8.vercel.app/auth/oauth/yandex"
                  //     },
                  //     "https://storeit-frontend-git-main-evevseevs-projects-fd07aed8.vercel.app",
                  //   )
                  //   .then(({ handler }: any) => alert("loaded"))
                  //   // .catch((error: any) => alert("Обработка ошибки"));
                  // }}
                  onReady={() => {
                    window.YaAuthSuggest.init(
                      {
                        client_id: "712925a705b34f5399ba6f067347266b",
                        response_type: "token",
                        redirect_uri:
                          "https://storeit-frontend-git-main-evevseevs-projects-fd07aed8.vercel.app/auth/oauth/yandex",
                      },
                      "https://storeit-frontend-git-main-evevseevs-projects-fd07aed8.vercel.app",
                      {
                        view: "button",
                        parentId: "buttonContainerId",
                        buttonSize: "m",
                        buttonView: "main",
                        buttonTheme: "light",
                        buttonBorderRadius: "0",
                        buttonIcon: "ya",
                      }
                    )
                      .then(({ handler }) => handler())
                      .then((data) => console.log("Сообщение с токеном", data))
                      .catch((error) => console.log("Обработка ошибки", error));
                  }}
                  onError={(e: any) => {
                    console.log(JSON.stringify(e));
                  }}
                />

                <Button
                  variant="outline"
                  type="button"
                  className="w-full -mt-4"
                >
                  Login with SSO
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
