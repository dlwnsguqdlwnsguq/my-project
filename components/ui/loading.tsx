import { cn } from '@/lib/utils/cn'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Loading indicator with planet rotation animation
 */
export function Loading({ size = 'md', className }: LoadingProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('relative', sizes[size])}>
        {/* Planet */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-purple to-primary-blue animate-spin" 
          style={{ animationDuration: '2s' }}
        />
        {/* Ring */}
        <div 
          className="absolute inset-[-25%] border-2 border-primary-blue/30 rounded-full"
          style={{ 
            transform: 'rotateX(75deg)',
          }}
        />
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-primary-blue/20 blur-md animate-pulse" />
      </div>
    </div>
  )
}

/**
 * Full page loading overlay
 */
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-black/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loading size="lg" />
        <p className="text-stardust-gray animate-pulse">로딩 중...</p>
      </div>
    </div>
  )
}
