import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string | undefined | null): string {
  const num = Number(price)
  if (isNaN(num) || num < 0) return "₹0"
  return `₹${num.toLocaleString("en-IN")}`
}
