import { type ClassValue, clsx, } from 'clsx'
import { twMerge, } from 'tailwind-merge'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const dateToString = (date: Date): string => {
  const offset = date.getTimezoneOffset() * 60000
  const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16)
  return localISOTime
}

export const clone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}
