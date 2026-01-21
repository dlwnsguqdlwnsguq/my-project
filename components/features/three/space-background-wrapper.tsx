'use client'

import dynamic from 'next/dynamic'
import { usePerformanceMode } from '@/hooks/use-performance-mode'

const SpaceBackground = dynamic(
  () => import('./star-field').then((mod) => mod.SpaceBackground),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-0 bg-space-black" />
    ),
  }
)

/**
 * Wrapper component for 3D space background
 * Dynamically imports Three.js to avoid SSR issues
 * Respects performance mode preference
 */
export function SpaceBackgroundWrapper() {
  const { isReducedMotion, isLoaded } = usePerformanceMode()

  // Static fallback for reduced motion
  if (!isLoaded) {
    return <div className="fixed inset-0 z-0 bg-space-black" />
  }

  if (isReducedMotion) {
    return (
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-space-black via-deep-navy to-space-black">
        {/* Static star pattern using CSS */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 20px 30px, #00F0FF, transparent),
              radial-gradient(2px 2px at 40px 70px, white, transparent),
              radial-gradient(1px 1px at 90px 40px, #7000FF, transparent),
              radial-gradient(2px 2px at 130px 80px, white, transparent),
              radial-gradient(1px 1px at 160px 120px, #00F0FF, transparent)`,
            backgroundSize: '200px 150px',
          }}
        />
      </div>
    )
  }

  return <SpaceBackground />
}
