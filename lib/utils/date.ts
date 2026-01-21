import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * Format date to Korean locale string
 * @example "2024년 1월 21일"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'yyyy년 M월 d일', { locale: ko })
}

/**
 * Format date to relative time
 * @example "3일 전"
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: ko })
}

/**
 * Format date for datetime attribute
 * @example "2024-01-21"
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'yyyy-MM-dd')
}
