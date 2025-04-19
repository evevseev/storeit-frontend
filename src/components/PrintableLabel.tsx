import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import QR from './QR';

interface LabelProps {
  url: string;
  name: string;
  description: string;
}

const styles = StyleSheet.create({
  label: {
    width: '100%',
    height: '100%',
    padding: '2mm',
    flexDirection: 'row',
    gap: '2mm',
  },
  qrContainer: {
    width: '20mm',
    height: '46mm',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: '2mm',
    justifyContent: 'center',
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: '2mm',
  },
  description: {
    fontSize: 9,
    lineHeight: 1.3,
  },
});

const PrintableLabel: React.FC<LabelProps> = ({ url, name, description }) => {
  return (
    <View style={styles.label}>
      <View style={styles.qrContainer}>
        <QR url={url} width={52} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

export default PrintableLabel; 