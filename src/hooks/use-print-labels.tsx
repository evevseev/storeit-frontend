import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import LabelsDocument from "@/components/labels/labels-document";

export interface Label {
  url?: string | null;
  name?: string | null;
  description?: string | null;
}

export interface PrintConfig {
  width?: number; // in millimeters
  height?: number; // in millimeters
}

const DEFAULT_CONFIG: Required<PrintConfig> = {
  width: 70,
  height: 50,
};

export function usePrintLabels() {
  const printLabels = React.useCallback(
    (labels: Label[], config?: PrintConfig) => {
      const finalConfig = {
        ...DEFAULT_CONFIG,
        ...config,
      };

      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Labels</title>
          <style>
            html, body, #root {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `);

      const container = printWindow.document.getElementById("root");
      if (container) {
        const root = printWindow.document.createElement("div");
        root.style.width = "100%";
        root.style.height = "100%";
        container.appendChild(root);

        const ReactDOM = require("react-dom/client");
        const reactRoot = ReactDOM.createRoot(root);

        reactRoot.render(
          <PDFViewer width="100%" height="100%">
            <LabelsDocument
              labels={labels}
              width={finalConfig.width}
              height={finalConfig.height}
            />
          </PDFViewer>
        );
      }
    },
    []
  );

  return { printLabels };
}
