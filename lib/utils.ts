import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES').format(d)
}

export function calculateIVA(base: number, rate: number): number {
  return base * (rate / 100)
}

export function calculateTotal(base: number, ivaRate: number): number {
  return base + calculateIVA(base, ivaRate)
}
