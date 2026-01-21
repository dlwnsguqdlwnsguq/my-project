'use client'

import { useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'

export interface EditorPaneProps {
  value: string
  onChange: (value: string) => void
}

export function EditorPane({ value, onChange }: EditorPaneProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.max(textarea.scrollHeight, 500)}px`
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key inserts spaces instead of changing focus
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2
      }, 0)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-deep-navy/50">
        <span className="text-sm font-medium text-stardust-gray">마크다운 에디터</span>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[500px] bg-transparent text-white font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-stardust-gray/50"
          placeholder="마크다운으로 글을 작성하세요..."
          spellCheck={false}
        />
      </div>
    </div>
  )
}
