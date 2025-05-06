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

interface ScanResult {
  ean: string;
  source: "ean" | "qr";
}

export default function ItemSearchPage() {
  const client = useApiQueryClient();
  const { data: items } = client.useQuery("get", "/items");
  const router = useRouter();

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

  const parseQrCode = useCallback((url: string): string | null => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured");
      }

      const itemsPath = `${apiUrl}/items/`;
      if (!url.startsWith(itemsPath)) {
        return null;
      }

      const itemId = url.substring(itemsPath.length);
      if (!itemId || itemId.length === 0) {
        return null;
      }

      return itemId;
    } catch (error) {
      console.error("Error parsing QR code:", error);
      return null;
    }
  }, []);

  const handleScanResult = useCallback(
    (result: ScanResult) => {
      console.log("Scanned item:", result);
      lastErrorRef.current = null;

      if (result.source === "ean") {
        const itemId = findItemByEan(result.ean);
        if (itemId) {
          router.push(`/items/${itemId}`);
        } else {
          showError("Товар с таким штрих-кодом не найден");
        }
      } else {
        // For QR codes, the ean field already contains the item ID
        router.push(`/items/${result.ean}`);
      }
    },
    [router, findItemByEan, showError]
  );

  const onNewScanResult = useCallback(
    (decodedText: string, result: Html5QrcodeResult) => {
      const format = result.result.format?.formatName;

      switch (format) {
        case SUPPORTED_FORMATS.EAN_13:
          handleScanResult({ ean: decodedText, source: "ean" });
          break;

        case SUPPORTED_FORMATS.QR_CODE:
          const itemId = parseQrCode(decodedText);
          if (itemId) {
            handleScanResult({ ean: itemId, source: "qr" });
          } else {
            showError("Просканированный QR-код не соответствует формату");
          }
          break;

        default:
          showError(
            "Просканированный штрих-код не соответствует формату или не поддерживается"
          );
      }
    },
    [showError, parseQrCode, handleScanResult]
  );

  return (
    <div className="w-screen">
      <Html5QrcodePlugin
        fps={10}
        qrbox={200}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
      />
    </div>
  );
}
