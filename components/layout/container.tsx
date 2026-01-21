import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Container({
  className,
  size = 'lg',
  ...props
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
  }

  return (
    <div
      className={cn('mx-auto px-4 sm:px-6', sizes[size], className)}
      {...props}
    />
  )
}
