'use client'

import { useState, useEffect } from 'react'
import { SESSION_COOKIE_NAME } from '@/lib/constants'

/**
 * Hook to check admin session status
 * Returns session validity from client-side cookie check
 */
export function useAdminSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = () => {
      const cookies = document.cookie.split(';')
      const sessionCookie = cookies.find((c) =>
        c.trim().startsWith(`${SESSION_COOKIE_NAME}=`)
      )
      setIsAuthenticated(!!sessionCookie)
      setIsLoading(false)
    }

    checkSession()
  }, [])

  return { isAuthenticated, isLoading }
}
