'use client'

import { useState, useEffect } from 'react'

const PERFORMANCE_MODE_KEY = 'stellar-performance-mode'

/**
 * Hook to manage performance mode (3D effects toggle)
 * Persists to localStorage
 */
export function usePerformanceMode() {
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const systemPrefersReduced = mediaQuery.matches

    // Check localStorage
    const stored = localStorage.getItem(PERFORMANCE_MODE_KEY)
    const userPreference = stored !== null ? stored === 'true' : null

    // User preference takes priority, fallback to system
    setIsReducedMotion(userPreference ?? systemPrefersReduced)
    setIsLoaded(true)

    // Listen for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(PERFORMANCE_MODE_KEY) === null) {
        setIsReducedMotion(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const togglePerformanceMode = () => {
    setIsReducedMotion((prev) => {
      const next = !prev
      localStorage.setItem(PERFORMANCE_MODE_KEY, String(next))
      return next
    })
  }

  return { isReducedMotion, isLoaded, togglePerformanceMode }
}
