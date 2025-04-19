import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import QR from "../QR";
import { Label } from "@/hooks/use-print-labels";

const styles = StyleSheet.create({
  label: {
    width: "100%",
    height: "100%",
    padding: "2mm",
    flexDirection: "row",
    gap: "2mm",
  },
  labelWithoutQR: {
    width: "100%",
    height: "100%",
    padding: "2mm",
  },
  qrContainer: {
    width: "20mm",
    height: "46mm",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    gap: "2mm",
    justifyContent: "center",
  },
  fullWidthContent: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    gap: "2mm",
    justifyContent: "center",
  },
  name: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: "2mm",
  },
  description: {
    fontSize: 9,
    lineHeight: 1.3,
  },
  url: {
    fontSize: 8,
    color: "#666666",
    marginTop: "auto",
  },
});

function PrintableLabel({ url, name, description }: Label) {
  // If no URL is provided, use full width layout
  if (!url) {
    return (
      <View style={styles.labelWithoutQR}>
        <View style={styles.fullWidthContent}>
          {name && <Text style={styles.name}>{name}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.label}>
      <View style={styles.qrContainer}>
        <QR url={url} width={52} />
      </View>
      <View style={styles.contentContainer}>
        {name && <Text style={styles.name}>{name}</Text>}
        {description && <Text style={styles.description}>{description}</Text>}
        {/* <Text style={styles.url}>{url}</Text> */}
      </View>
    </View>
  );
}

export default PrintableLabel;
