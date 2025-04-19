import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import LabelsDocument from "@/components/LabelsDocument";

interface Label {
  url: string;
  name: string;
  description: string;
}

const usePrintLabels = () => {
  const printLabels = React.useCallback((labels: Label[]) => {
    // Create a new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Write the PDF viewer content to the new window
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

    // Render the PDF viewer with labels
    const container = printWindow.document.getElementById('root');
    if (container) {
      const root = printWindow.document.createElement('div');
      root.style.width = '100%';
      root.style.height = '100%';
      container.appendChild(root);

      const ReactDOM = require('react-dom/client');
      const reactRoot = ReactDOM.createRoot(root);
      
      reactRoot.render(
        <PDFViewer width="100%" height="100%">
          <LabelsDocument labels={labels} />
        </PDFViewer>
      );
    }
  }, []);

  return { printLabels };
};

export default usePrintLabels; 