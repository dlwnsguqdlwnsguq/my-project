'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import type { Tag } from '@/types/model'

export interface TagListProps {
  tags: Tag[]
  className?: string
}

export function TagList({ tags, className }: TagListProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTag = searchParams.get('tag')

  const createTagUrl = (tagName: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (tagName) {
      params.set('tag', tagName)
    } else {
      params.delete('tag')
    }
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Link href={createTagUrl(null)}>
        <Badge variant={!activeTag ? 'active' : 'default'}>
          전체
        </Badge>
      </Link>
      {tags.map((tag) => (
        <Link key={tag.id} href={createTagUrl(tag.name)}>
          <Badge variant={activeTag === tag.name ? 'active' : 'default'}>
            {tag.name}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
