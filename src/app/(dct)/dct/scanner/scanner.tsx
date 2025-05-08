"use client";

import Html5QrcodePlugin from "@/components/Html5QrcodePlugin";
import { Html5QrcodeResult } from "html5-qrcode";
import { toast } from "sonner";
import { useCallback, useRef } from "react";

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
    [onScan, showError, validateUrl]
  );

  return (
    <div className="flex items-center justify-center w-full">
      <Html5QrcodePlugin
        fps={10}
        qrbox={200}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
      />
    </div>
  );
} 