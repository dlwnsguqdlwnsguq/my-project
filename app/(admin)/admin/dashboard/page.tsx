'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, LogOut, Loader2 } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { DashboardTable } from '@/components/features/admin/dashboard-table'
import { getAdminPosts, deletePost, toggleFeatured } from '@/app/actions/post'
import type { Post } from '@/types/model'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  // Fetch posts on mount
  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const data = await getAdminPosts()
      setPosts(data)
    } catch (error) {
      console.error('Failed to load posts:', error)
      alert('데이터를 불러오는데 실패했습니다. 환경변수(Service Role Key)를 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setPostToDelete(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete)
        // Optimistic update or reload
        setPosts((prev) => prev.filter((p) => p.id !== postToDelete))
        setDeleteModalOpen(false)
        setPostToDelete(null)
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.')
        console.error(error)
      }
    }
  }

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isFeatured } : { ...p, isFeatured: false }
        )
      )
      await toggleFeatured(id, isFeatured)
    } catch (error) {
      console.error(error)
      alert('상태 변경 실패')
      loadPosts() // Revert
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen py-12">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">대시보드</h1>
            <p className="text-stardust-gray mt-1">
              {isLoading ? '로딩 중...' : `총 ${posts.length}개의 글`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/editor">
              <Button>
                <Plus className="w-5 h-5" />
                새 글 작성
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
              로그아웃
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover={false}>
            <p className="text-stardust-gray text-sm">전체 글</p>
            <p className="text-3xl font-bold text-white mt-1">
              {isLoading ? '-' : posts.length}
            </p>
          </Card>
          <Card hover={false}>
            <p className="text-stardust-gray text-sm">발행됨</p>
            <p className="text-3xl font-bold text-primary-blue mt-1">
              {isLoading ? '-' : posts.filter((p) => p.isPublished).length}
            </p>
          </Card>
          <Card hover={false}>
            <p className="text-stardust-gray text-sm">임시저장</p>
            <p className="text-3xl font-bold text-primary-purple mt-1">
              {isLoading ? '-' : posts.filter((p) => !p.isPublished).length}
            </p>
          </Card>
        </div>

        {/* Posts Table */}
        <Card hover={false} className="overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
            </div>
          ) : (
            <DashboardTable
              posts={posts}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
            />
          )}
        </Card>

        {/* Delete Confirmation Modal */}
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
            <Button variant="danger" onClick={confirmDelete}>
              삭제
            </Button>
          </div>
        </Modal>
      </Container>
    </div>
  )
}
