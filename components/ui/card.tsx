import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid'
  hover?: boolean
}

export function Card({
  className,
  variant = 'glass',
  hover = true,
  children,
  ...props
}: CardProps) {
  const variants = {
    glass: 'bg-white/5 backdrop-blur-md border border-white/10',
    solid: 'bg-deep-navy border border-white/10',
  }

  return (
    <div
      className={cn(
        'rounded-xl p-5 transition-all duration-300',
        variants[variant],
        hover && 'hover:-translate-y-1 hover:border-primary-blue/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-semibold text-white', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-stardust-gray mt-1', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-white/10 flex items-center gap-3', className)}
      {...props}
    />
  )
}
