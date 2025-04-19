import React, { useMemo } from "react";
import { Rect, Svg } from "@react-pdf/renderer";
import { getMatrix } from "qr-code-generator-lib";

interface QRProps {
  url: string;
  level?: keyof typeof EcLevels;
  width?: number;
  foreground?: string;
  background?: string;
}

enum EcLevels {
  L = 0,
  M = 1,
  Q = 2,
  H = 3,
}

const QR = ({
  url,
  level = "H",
  width = 64,
  foreground = "#000",
  background = "#fff",
}: QRProps): JSX.Element => {
  // EcLevels seems to not do anything...
  // @ts-expect-error qr-code-generator-lib-misstype
  const matrix = useMemo(() => getMatrix(url), EcLevels[level], [url, level]);
  const factor = useMemo(() => width / matrix.length, [matrix, width]);

  return (
    <Svg width={width} height={width} viewBox={`0 0 ${width} ${width}`}>
      {matrix.map((row, x) =>
        row.map((cell, y) => (
          <Rect
            x={x * factor}
            y={y * factor}
            width={1 * factor}
            height={1 * factor}
            fill={cell ? foreground : background}
          />
        ))
      )}
    </Svg>
  );
};

export default QR; 