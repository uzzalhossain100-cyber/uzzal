"use client";

import React, { useMemo } from 'react';
import { generateQRCodeMatrix } from '@/lib/qrGenerator';

interface QRCodeViewProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 180,
  fgColor = "#581c87",
  bgColor = "#ffffff",
  className = "",
}) => {
  const matrix = useMemo(() => {
    try {
      return generateQRCodeMatrix(value || window.location.origin || "https://all-in-one.app");
    } catch {
      return generateQRCodeMatrix("https://all-in-one.app");
    }
  }, [value]);

  const n = matrix.length;
  const cellSize = size / n;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`rounded-xl ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      <rect width={size} height={size} fill={bgColor} />
      {matrix.map((row, r) =>
        row.map((cell, c) => {
          if (!cell) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.05}
              height={cellSize + 0.05}
              fill={fgColor}
            />
          );
        })
      )}
    </svg>
  );
};