"use client";
import Script from "next/script";

export default function YandexOauthRedirectPage() {
  return (
    <Script
      src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js"
      onLoad={() => {
        (window as any).YaSendSuggestToken(process.env.NEXT_PUBLIC_APP_URL, {
          oauthProvider: "yandex",
        });
      }}
    />
  );
}
