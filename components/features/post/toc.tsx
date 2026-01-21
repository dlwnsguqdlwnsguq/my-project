'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { TOCItem } from '@/types/model'

export interface TOCProps {
  items: TOCItem[]
  className?: string
}

export function TOC({ items, className }: TOCProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0,
      }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav className={cn('', className)}>
      <h4 className="text-sm font-semibold text-white mb-4">목차</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <Link
              href={`#${item.id}`}
              className={cn(
                'block text-sm py-1 transition-colors border-l-2 pl-3 -ml-px',
                activeId === item.id
                  ? 'text-primary-blue border-primary-blue'
                  : 'text-stardust-gray hover:text-white border-transparent hover:border-white/30'
              )}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
