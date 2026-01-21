'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/constants'
import { useScrollPosition } from '@/hooks/use-scroll-position'
import { usePerformanceMode } from '@/hooks/use-performance-mode'

export function Header() {
  const pathname = usePathname()
  const { isScrolled } = useScrollPosition()
  const { isReducedMotion, togglePerformanceMode } = usePerformanceMode()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-space-black/80 backdrop-blur-lg border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-xl hover:text-primary-blue transition-colors"
          >
            <Sparkles className="w-6 h-6 text-primary-blue" />
            <span>{SITE_CONFIG.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-primary-blue'
                    : 'text-stardust-gray hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Performance Mode Toggle */}
            <button
              onClick={togglePerformanceMode}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isReducedMotion
                  ? 'text-stardust-gray hover:text-white hover:bg-white/10'
                  : 'text-primary-blue hover:bg-primary-blue/10'
              )}
              title={isReducedMotion ? '애니메이션 켜기' : '저사양 모드'}
              aria-label={isReducedMotion ? '애니메이션 켜기' : '저사양 모드'}
            >
              <Zap className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'block py-3 text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'text-primary-blue'
                    : 'text-stardust-gray hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
