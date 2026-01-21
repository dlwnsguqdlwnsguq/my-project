'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send, ArrowLeft, Eye, EyeOff, Trash2 } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { EditorPane } from '@/components/features/admin/editor-pane'
import { PreviewPane } from '@/components/features/admin/preview-pane'

// Mock post data - will be replaced with Supabase query
const MOCK_POST = {
  id: '1',
  title: 'Next.js 15에서 달라진 것들',
  content: `## 소개

Next.js 15이 출시되었습니다...`,
  tags: 'Next.js, TypeScript',
  isPublished: true,
}

interface EditorEditPageProps {
  params: Promise<{ id: string }>
}

export default function AdminEditorEditPage({ params }: EditorEditPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  useEffect(() => {
    // In real app, fetch post from Supabase
    setTitle(MOCK_POST.title)
    setContent(MOCK_POST.content)
    setTags(MOCK_POST.tags)
  }, [id])

  const handleSave = async (publish: boolean = false) => {
    if (publish) {
      setIsPublishing(true)
    } else {
      setIsSaving(true)
    }

    try {
      // In real app, this would be a server action
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push('/admin/dashboard')
    } finally {
      setIsSaving(false)
      setIsPublishing(false)
    }
  }

  const handleDelete = async () => {
    // In real app, this would be a server action
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push('/admin/dashboard')
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
                onClick={() => setDeleteModalOpen(true)}
                className="text-accent-pink hover:bg-accent-pink/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden md:flex"
              >
                {showPreview ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSave(false)}
                isLoading={isSaving}
                disabled={!title}
              >
                <Save className="w-4 h-4" />
                저장
              </Button>
              <Button
                onClick={() => handleSave(true)}
                isLoading={isPublishing}
                disabled={!title || !content}
              >
                <Send className="w-4 h-4" />
                {MOCK_POST.isPublished ? '업데이트' : '발행'}
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
              placeholder="태그를 쉼표로 구분하여 입력"
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

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="글 삭제"
      >
        <p className="text-stardust-gray mb-6">
          정말로 이 글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            삭제
          </Button>
        </div>
      </Modal>
    </div>
  )
}
