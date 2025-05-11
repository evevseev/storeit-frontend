"use client";

import Html5QrcodePlugin from "@/components/Html5QrcodePlugin";
import { Html5QrcodeResult } from "html5-qrcode";
import { toast } from "sonner";
import { useCallback, useRef } from "react";

export default function ItemSearchPage() {
  const lastErrorRef = useRef<string | null>(null);
  const lastErrorTimeRef = useRef<number>(0);
  const ERROR_COOLDOWN_MS = 3000; // 3 seconds cooldown between same errors

  const showError = useCallback((errorMessage: string) => {
    const now = Date.now();
    // Only show error if it's different from the last one or enough time has passed
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
      console.log("result: " + JSON.stringify(result.result));
      if (result.result.format?.formatName === "EAN_13") {
        const itemEan = result.decodedText;
        // Reset error state on successful scan
        lastErrorRef.current = null;
      } else if (result.result.format?.formatName === "QR_CODE") {
        const itemId = getItemIdFromQrCode(decodedText);
        if (itemId) {
          const ean = getEan(itemId);
          // Reset error state on successful scan
          lastErrorRef.current = null;
        } else {
          showError("Просканированный QR-код не соответствует формату");
        }
      } else {
        showError(
          "Просканированный штрих-код не соответствует формату или не поддерживается"
        );
      }
    },
    [showError]
  );

  function getItemIdFromQrCode(url: string) {
    // format of item url is NEXT_PUBLIC_API_URL/items/<uuid>
    const regex = new RegExp(process.env.NEXT_PUBLIC_API_URL!);
    const match = url.match(regex);
    if (match) {
      return match[1];
    }
    return null;
  }

  return (
    <div className="App w-screen">
      <Html5QrcodePlugin
        fps={10}
        qrbox={200}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
      />
    </div>
  );
}
