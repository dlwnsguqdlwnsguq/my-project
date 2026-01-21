/**
 * Global Constants
 */

export const SITE_CONFIG = {
  name: 'Stellar-Mark',
  slogan: '우주를 유영하며 기록하는 나만의 지식 성계',
  description: '유니크한 우주 테마 디자인의 마크다운 블로그',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
}

export const NAV_ITEMS = [
  { label: '홈', href: '/' },
  { label: '글 목록', href: '/posts' },
] as const

export const ADMIN_NAV_ITEMS = [
  { label: '대시보드', href: '/admin/dashboard' },
  { label: '새 글 작성', href: '/admin/editor' },
] as const

export const POSTS_PER_PAGE = 12

export const SESSION_COOKIE_NAME = 'stellar-admin-session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days in seconds

export const CAPTCHA_OPERATORS = ['+', '-'] as const

/**
 * Generate simple math captcha
 */
export function generateCaptcha(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  const operator = CAPTCHA_OPERATORS[Math.floor(Math.random() * CAPTCHA_OPERATORS.length)]

  if (operator === '+') {
    return { question: `${a} + ${b} = ?`, answer: a + b }
  } else {
    const max = Math.max(a, b)
    const min = Math.min(a, b)
    return { question: `${max} - ${min} = ?`, answer: max - min }
  }
}

export const ERROR_MESSAGES = {
  GENERIC: '오류가 발생했습니다. 다시 시도해주세요.',
  UNAUTHORIZED: '권한이 없습니다.',
  NOT_FOUND: '페이지를 찾을 수 없습니다.',
  INVALID_CAPTCHA: '보안 문자가 올바르지 않습니다.',
  REQUIRED_FIELDS: '필수 항목을 모두 입력해주세요.',
  INVALID_PASSWORD: '비밀번호가 올바르지 않습니다.',
}
