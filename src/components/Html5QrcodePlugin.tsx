"use client";
import {
  Html5QrcodeScanner,
  QrcodeErrorCallback,
  QrcodeSuccessCallback,
} from "html5-qrcode";
import { useEffect } from "react";
import "../styles/qrcode-scanner.css";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
  fps?: number;
  qrbox?: number | { width: number; height: number };
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback: QrcodeSuccessCallback;
  qrCodeErrorCallback?: QrcodeErrorCallback;
}

function createConfig(props: Html5QrcodePluginProps): Html5QrcodeScannerConfig {
  let config = {};
  if (props.fps) {
    config = { ...config, fps: props.fps };
  }
  if (props.qrbox) {
    config = { ...config, qrbox: props.qrbox };
  }
  if (props.aspectRatio) {
    config = { ...config, aspectRatio: props.aspectRatio };
  }
  if (props.disableFlip !== undefined) {
    config = { ...config, disableFlip: props.disableFlip };
  }
  return config as Html5QrcodeScannerConfig;
}

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = (props) => {
  useEffect(() => {
    let html5QrcodeScanner: Html5QrcodeScanner | null = null;

    const initializeScanner = async () => {
      const config = createConfig(props);
      const verbose = props.verbose === true;

      if (!props.qrCodeSuccessCallback) {
        throw new Error("qrCodeSuccessCallback is required callback.");
      }

      // Clean up existing scanner if it exists
      if (html5QrcodeScanner) {
        await html5QrcodeScanner.clear();
      }

      html5QrcodeScanner = new Html5QrcodeScanner(
        qrcodeRegionId,
        config,
        verbose
      );

      html5QrcodeScanner.render(
        props.qrCodeSuccessCallback,
        props.qrCodeErrorCallback
      );
    };

    initializeScanner().catch((error) => {
      console.error("Failed to initialize scanner:", error);
    });

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch((error) => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [
    props.qrCodeSuccessCallback,
    props.qrCodeErrorCallback,
    props.fps,
    props.qrbox,
    props.aspectRatio,
    props.disableFlip,
    props.verbose,
  ]);

  return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
