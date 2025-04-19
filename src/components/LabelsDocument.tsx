import React from 'react';
import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import PrintableLabel from './PrintableLabel';

interface Label {
  url: string;
  name: string;
  description: string;
}

interface LabelsDocumentProps {
  labels: Label[];
}

// Convert mm to points (1 mm = 2.83465 points)
const mmToPoints = (mm: number) => mm * 2.83465;

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    width: mmToPoints(70),
    height: mmToPoints(50),
  },
});

const LabelsDocument: React.FC<LabelsDocumentProps> = ({ labels }) => {
  return (
    <Document>
      {labels.map((label, index) => (
        <Page 
          key={index} 
          size={[mmToPoints(70), mmToPoints(50)]} 
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