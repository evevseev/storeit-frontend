"use client";
import React from "react";
import usePrintLabels from "@/hooks/usePrintLabels";
import { Button } from "@/components/ui/button";

const exampleLabels = [
  {
    url: "https://example.com/item1",
    name: "Storage Box A1",
    description:
      "Large plastic container\nDimensions: 60x40x30cm\nLocation: Shelf 3",
  },
  {
    url: "https://example.com/item2",
    name: "Tool Set B2",
    description:
      "Complete set of hand tools\nContains: 24 pieces\nCategory: Hardware",
  },
  {
    url: "https://example.com/item3",
    name: "Electronics Box C3",
    description:
      "Various electronic components\nVoltage: 5-12V\nWarning: Contains sensitive items",
  },
];

const PDFPage: React.FC = () => {
  const { printLabels } = usePrintLabels();

  const handlePrint = () => {
    printLabels(exampleLabels);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Label Printer Demo
          </h1>
          <Button onClick={handlePrint}>
            Generate Example Labels
          </Button  >
          <p className="mt-4 text-sm text-gray-600">
            Click the button above to generate and view example labels in a new
            tab
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFPage;
