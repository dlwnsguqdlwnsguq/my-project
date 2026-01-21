'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditorPane } from '@/components/features/admin/editor-pane'
import { PreviewPane } from '@/components/features/admin/preview-pane'

import { createPost } from '@/app/actions/post'

export default function AdminEditorPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const handleSave = async (publish: boolean = false) => {
    if (publish) {
      setIsPublishing(true)
    } else {
      setIsSaving(true)
    }

    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
      
      await createPost(
        title,
        content,
        tagList,
        publish
      )

      alert(publish ? '글이 발행되었습니다.' : '임시저장 되었습니다.')
      router.push('/admin/dashboard')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toolbar */}
      <div className="sticky top-16 z-30 bg-deep-navy/90 backdrop-blur-lg border-b border-white/10">
        <Container>
          <div className="flex items-center justify-between py-3 gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
              돌아가기
            </Button>

            <div className="flex-1 max-w-xl">
              <Input
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-center font-semibold"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden md:flex"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    미리보기 숨기기
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    미리보기
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSave(false)}
                isLoading={isSaving}
                disabled={!title}
              >
                <Save className="w-4 h-4" />
                임시저장
              </Button>
              <Button
                onClick={() => handleSave(true)}
                isLoading={isPublishing}
                disabled={!title || !content}
              >
                <Send className="w-4 h-4" />
                발행
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Tags Input */}
      <div className="border-b border-white/10 bg-deep-navy/50">
        <Container>
          <div className="py-3">
            <Input
              placeholder="태그를 쉼표로 구분하여 입력 (예: React, Next.js, TypeScript)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="text-sm"
            />
          </div>
        </Container>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex">
        <div
          className={`flex-1 border-r border-white/10 bg-space-black ${
            showPreview ? 'w-1/2' : 'w-full'
          }`}
        >
          <EditorPane value={content} onChange={setContent} />
        </div>
        {showPreview && (
          <div className="flex-1 w-1/2 bg-deep-navy/30 hidden md:block">
            <PreviewPane content={content} title={title} />
          </div>
        )}
      </div>
    </div>
  )
}
