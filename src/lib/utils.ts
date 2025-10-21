import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeToAscii(input: string | null | undefined): string | null {
  if (input === null || input === undefined) {
    return null;
  }
  // Remove any character that is not in the ASCII range (0-127)
  return input.replace(/[^\x00-\x7F]/g, '');
}