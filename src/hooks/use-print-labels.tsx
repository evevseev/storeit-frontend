import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import LabelsDocument from "@/components/labels/labels-document";
import { appUrl } from "@/lib/consts";

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

export function getUnitLabel({
  id,
  name,
  address,
  alias,
}: {
  id: string;
  name: string;
  address: string;
  alias: string;
}): Label {
  return {
    url: `${appUrl}/units/${id}`,
    name: `${name} (${alias})`,
    description: address,
  };
}

export function getInstanceLabel({
  id,
  name,
  variant,
  instanceId,
}: {
  id: string;
  name: string;
  variant: string;
  instanceId: string;
}): Label {
  return {
    url: `${appUrl}/instances/${instanceId}`,
    name: `${name} ${variant}`,
    description: id.split("-")[0],
  };
}

export function getGroupLabel({
  id,
  name,
  alias,
}: {
  id: string;
  name: string;
  alias: string;
}): Label {
  return {
    url: `${appUrl}/storage-groups/${id}`,
    name: `${name} (${alias})`,
  };
}

export function getCellLabel({
  id,
  alias,
  row,
  level,
  position,
}: {
  id: string;
  alias: string;
  row: number;
  level: number;
  position: number;
}): Label {
  return {
    url: `${appUrl}/cells/${id}`,
    name: alias,
    description: `Ячейка\nРяд: ${row}\nУровень: ${level}\nПозиция: ${position}`,
  };
}

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
