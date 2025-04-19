import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import PrintableLabel from "@/components/labels/printable-label";

interface Label {
  url: string;
  name: string;
  description: string;
}

interface LabelsDocumentProps {
  labels: Label[];
  width?: number; // in millimeters
  height?: number; // in millimeters
}

// Convert mm to points (1 mm = 2.83465 points)
const mmToPoints = (mm: number) => mm * 2.83465;

const LabelsDocument: React.FC<LabelsDocumentProps> = ({
  labels,
  width = 70, // default width in mm
  height = 50, // default height in mm
}) => {
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
          <PrintableLabel
            url={label.url}
            name={label.name}
            description={label.description}
          />
        </Page>
      ))}
    </Document>
  );
};

export default LabelsDocument;
