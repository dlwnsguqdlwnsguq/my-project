'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { generateCaptcha, ERROR_MESSAGES } from '@/lib/constants'

export interface CommentFormProps {
  postId: string
  onSubmit: (data: {
    nickname: string
    password: string
    content: string
  }) => Promise<boolean>
}

export function CommentForm({ postId, onSubmit }: CommentFormProps) {
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [content, setContent] = useState('')
  const [captcha, setCaptcha] = useState({ question: '', answer: 0 })
  const [captchaInput, setCaptchaInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setCaptcha(generateCaptcha())
  }, [])

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
    setCaptchaInput('')
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!nickname.trim()) {
      newErrors.nickname = '닉네임을 입력하세요.'
    }
    if (!password.trim() || password.length < 4) {
      newErrors.password = '비밀번호는 4자 이상 입력하세요.'
    }
    if (!content.trim()) {
      newErrors.content = '내용을 입력하세요.'
    }
    if (parseInt(captchaInput, 10) !== captcha.answer) {
      newErrors.captcha = ERROR_MESSAGES.INVALID_CAPTCHA
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    try {
      const success = await onSubmit({
        nickname: nickname.trim(),
        password,
        content: content.trim(),
      })

      if (success) {
        setNickname('')
        setPassword('')
        setContent('')
        setCaptchaInput('')
        refreshCaptcha()
        setErrors({})
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="닉네임"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          error={errors.nickname}
          maxLength={20}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호 (삭제 시 필요)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          maxLength={20}
        />
      </div>

      <Textarea
        label="내용"
        placeholder="댓글을 입력하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        error={errors.content}
        rows={4}
        maxLength={1000}
      />

      {/* Captcha */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Input
            label={`보안 문자: ${captcha.question}`}
            placeholder="정답 입력"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            error={errors.captcha}
            type="number"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={refreshCaptcha}
          className="mb-[2px]"
        >
          새로고침
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          댓글 작성
        </Button>
      </div>
    </form>
  )
}
