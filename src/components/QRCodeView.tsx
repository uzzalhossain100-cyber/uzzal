"use client";

import React, { useState } from 'react';
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
  const [hasError, setHasError] = useState(false);

  // Fallback to online QR image if matrix generator encounters edge cases
  const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value || 'https://all-in-one.app')}&color=7c3aed&bgcolor=ffffff`;

  if (hasError) {
    return (
      <img
        src={fallbackUrl}
        alt="QR Code"
        width={size}
        height={size}
        className={`rounded-xl object-contain ${className}`}
      />
    );
  }

  try {
    const textToEncode = value || (typeof window !== 'undefined' ? window.location.origin : "https://all-in-one.app");
    const matrix = generateQRCodeMatrix(textToEncode);
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
  } catch (err) {
    setHasError(true);
    return (
      <img
        src={fallbackUrl}
        alt="QR Code"
        width={size}
        height={size}
        className={`rounded-xl object-contain ${className}`}
      />
    );
  }
};