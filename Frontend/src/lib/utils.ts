import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let _debounceTimeout: number | null = null
export function debounce(func: Function, wait: number) {
  if (_debounceTimeout) clearTimeout(_debounceTimeout)
  _debounceTimeout = setTimeout(func, wait)
}