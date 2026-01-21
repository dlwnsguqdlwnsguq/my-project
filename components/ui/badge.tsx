import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'active' | 'admin'
  size?: 'sm' | 'md'
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-primary-blue/10 text-primary-blue border-primary-blue/20',
    active: 'bg-primary-blue/20 text-primary-blue border-primary-blue ring-2 ring-primary-blue/30',
    admin: 'bg-primary-purple/20 text-primary-purple border-primary-purple',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-all duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}
