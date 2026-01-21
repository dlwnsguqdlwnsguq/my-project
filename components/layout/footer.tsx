import Link from 'next/link'
import { Github, Twitter, Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-white/10 bg-deep-navy/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-stardust-gray">
            © {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stardust-gray hover:text-primary-blue transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stardust-gray hover:text-primary-blue transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="mailto:contact@example.com"
              className="text-stardust-gray hover:text-primary-blue transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Admin Link */}
          <Link
            href="/admin/login"
            className="text-sm text-stardust-gray/50 hover:text-stardust-gray transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
