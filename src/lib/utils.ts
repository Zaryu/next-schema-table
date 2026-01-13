import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatColumnLabel(column: string) {
  return column
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (t) => {
      return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
    });
}
