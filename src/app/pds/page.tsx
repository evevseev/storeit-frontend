'use client';

import React from 'react';
import usePrintLabels from '@/hooks/usePrintLabels';

const exampleLabels = [
  {
    url: 'https://example.com/item1',
    name: 'Storage Box A1',
    description: 'Large plastic container\nDimensions: 60x40x30cm\nLocation: Shelf 3\nCategory: Storage',
  },
  {
    url: 'https://example.com/item2',
    name: 'Tool Set B2',
    description: 'Complete set of hand tools\nContains: 24 pieces\nCategory: Hardware\nMaintenance due: Q2 2024',
  },
  {
    url: 'https://example.com/item3',
    name: 'Electronics Box C3',
    description: 'Various electronic components\nVoltage: 5-12V\nWarning: Contains sensitive items\nInventory: 145 pcs',
  },
];

export default function PDFPage() {
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
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Generate Example Labels
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Click the button above to generate labels (70x50mm each) in a new tab
          </p>
          <div className="mt-8 text-left max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Example Output:</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>Each label will be on its own page</li>
              <li>Pages are sized exactly 70x50mm</li>
              <li>QR code on the left side</li>
              <li>Name in bold at the top</li>
              <li>Multi-line description below</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 