import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import PrintableLabel from "@/components/labels/printable-label";
import { Label } from "@/hooks/use-print-labels";
import "@/utils/fonts";

interface LabelsDocumentProps {
  labels: Label[];
  width?: number; // in millimeters
  height?: number; // in millimeters
}

//  (1 mm = 2.83465 points)
const mmToPoints = (mm: number) => mm * 2.83465;

function LabelsDocument({
  labels,
  width = 70, // default width in mm
  height = 50, // default height in mm
}: LabelsDocumentProps) {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
      width: mmToPoints(width),
      height: mmToPoints(height),
    },
  });

  return (
    <Document>
      {labels.map((label, index) => (
        <Page
          key={index}
          size={[mmToPoints(width), mmToPoints(height)]}
          style={styles.page}
        >
          <PrintableLabel {...label} />
        </Page>
      ))}
    </Document>
  );
}

export default LabelsDocument;
