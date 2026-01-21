import type { TOCItem } from '@/types/model'

/**
 * Extract Table of Contents from markdown content
 * Parses headings (## and ###) and generates anchor IDs
 */
export function extractTOC(markdown: string): TOCItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const items: TOCItem[] = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = generateSlug(text)

    items.push({ id, text, level })
  }

  return items
}

/**
 * Generate URL-safe slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Extract first paragraph as description
 */
export function extractDescription(markdown: string, maxLength = 160): string {
  // Remove headings
  const withoutHeadings = markdown.replace(/^#+\s+.+$/gm, '')
  // Remove code blocks
  const withoutCode = withoutHeadings.replace(/```[\s\S]*?```/g, '')
  // Remove inline code
  const withoutInlineCode = withoutCode.replace(/`[^`]+`/g, '')
  // Remove links but keep text
  const withoutLinks = withoutInlineCode.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  // Remove images
  const withoutImages = withoutLinks.replace(/!\[[^\]]*\]\([^)]+\)/g, '')
  // Get first non-empty line
  const firstParagraph = withoutImages
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)[0] || ''

  return truncateText(firstParagraph, maxLength)
}
