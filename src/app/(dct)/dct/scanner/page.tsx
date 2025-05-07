"use client";

import Html5QrcodePlugin from "@/components/Html5QrcodePlugin";
import { Html5QrcodeResult } from "html5-qrcode";
import { toast } from "sonner";
import { useCallback, useRef } from "react";
import { useApiQueryClient } from "@/hooks/use-api-query-client";
import { useRouter } from "next/navigation";

const ERROR_COOLDOWN_MS = 3000;
const SUPPORTED_FORMATS = {
  EAN_13: "EAN_13",
  QR_CODE: "QR_CODE",
} as const;

export interface ScannerResult {
  value: string;
  source: "ean" | "qr";
}

export type ScannerProps = {
  onScan: (result: ScannerResult) => void;
  validateUrl?: boolean;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export function Scanner({ onScan, validateUrl = true }: ScannerProps) {
  const lastErrorRef = useRef<string | null>(null);
  const lastErrorTimeRef = useRef<number>(0);

  const showError = useCallback((errorMessage: string) => {
    const now = Date.now();
    if (
      lastErrorRef.current !== errorMessage ||
      now - lastErrorTimeRef.current > ERROR_COOLDOWN_MS
    ) {
      toast.error(errorMessage);
      lastErrorRef.current = errorMessage;
      lastErrorTimeRef.current = now;
    }
  }, []);

  const onNewScanResult = useCallback(
    (decodedText: string, result: Html5QrcodeResult) => {
      console.log("Scan Result:", {
        decodedText,
        format: result.result.format?.formatName,
        timestamp: new Date().toISOString(),
        result,
      });

      const format = result.result.format?.formatName;

      switch (format) {
        case SUPPORTED_FORMATS.EAN_13:
          onScan({ value: decodedText, source: "ean" });
          break;

        case SUPPORTED_FORMATS.QR_CODE:
          if (validateUrl) {
            if (decodedText.startsWith(apiUrl)) {
              return;
            } else {
              showError("Просканированный QR-код не соответствует формату");
            }
          }
          onScan({ value: decodedText, source: "qr" });
          break;
        default:
          showError(
            "Просканированный штрих-код не соответствует формату или не поддерживается"
          );
      }
    },
    [onScan, showError]
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Html5QrcodePlugin
        fps={10}
        qrbox={200}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
      />
    </div>
  );
}

export default function ScannerPage() {
  const client = useApiQueryClient();
  const { data: items } = client.useQuery("get", "/items");
  const router = useRouter();

  const findItemByEan = useCallback(
    (ean: string) => {
      if (!items || !items.data) return null;

      const item = items.data.find((item) =>
        item.variants.some(
          (variant) => variant.ean13 && String(variant.ean13) === ean
        )
      );
      if (item) {
        return item.id;
      }

      return null;
    },
    [items]
  );

  function handleScanResult(result: ScannerResult) {
    if (result.source === "ean") {
      const itemId = findItemByEan(result.value);
      if (itemId) {
        router.push(`/items/${itemId}`);
      }
    } else {
      router.push(result.value);
    }
  }

  return <Scanner onScan={handleScanResult} validateUrl={false} />;
}
