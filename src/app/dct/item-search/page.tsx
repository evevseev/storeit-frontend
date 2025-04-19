"use client";

import Html5QrcodePlugin from "@/components/Html5QrcodePlugin";

export default function ItemSearchPage() {
  const [decodedResults, setDecodedResults] = useState<any>([]);
  const onNewScanResult = (decodedText: any, decodedResult: any) => {
    console.log("App [result]", decodedResult);
    alert(decodedText);
    setDecodedResults((prev: any) => [...prev, decodedResult]);
  };

  return (
    <div className="App w-screen">
      <section className="App-section">
        <div className="App-section-title"> Html5-qrcode React demo</div>
        <br />
        <br />
        <br />
        <Html5QrcodePlugin
          fps={10}
          qrbox={200}
          disableFlip={false}
          qrCodeSuccessCallback={onNewScanResult}
        />
        <ResultContainerPlugin results={decodedResults} />
      </section>
    </div>
  );
}

import React, { useState } from "react";

function filterResults(results: any) {
  let filteredResults = [];
  for (var i = 0; i < results.length; ++i) {
    if (i === 0) {
      filteredResults.push(results[i]);
      continue;
    }

    if (results[i].decodedText !== results[i - 1].decodedText) {
      filteredResults.push(results[i]);
    }
  }
  return filteredResults;
}

const ResultContainerTable = ({ data }: any) => {
  const results = filterResults(data);
  return (
    <table className={"Qrcode-result-table"}>
      <thead>
        <tr>
          <td>#</td>
          <td>Decoded Text</td>
          <td>Format</td>
        </tr>
      </thead>
      <tbody>
        {results.map((result, i) => {
          console.log(result);
          return (
            <tr key={i}>
              <td>{i}</td>
              <td>{result.decodedText}</td>
              <td>{result.result.format.formatName}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const ResultContainerPlugin = (props: any) => {
  const results = filterResults(props.results);
  return (
    <div className="Result-container">
      <div className="Result-header">Scanned results ({results.length})</div>
      <div className="Result-section">
        <ResultContainerTable data={results} />
      </div>
    </div>
  );
};
