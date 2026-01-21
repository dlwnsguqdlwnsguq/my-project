'use client'

import { useState } from 'react'
import { CommentItem } from './comment-item'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Comment } from '@/types/model'

export interface CommentListProps {
  comments: Comment[]
  onDeleteComment?: (commentId: string, password: string) => Promise<boolean>
}

export function CommentList({ comments, onDeleteComment }: CommentListProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (commentId: string) => {
    setSelectedCommentId(commentId)
    setDeletePassword('')
    setDeleteError('')
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedCommentId || !onDeleteComment) return

    setIsDeleting(true)
    setDeleteError('')

    try {
      const success = await onDeleteComment(selectedCommentId, deletePassword)
      if (success) {
        setDeleteModalOpen(false)
        setSelectedCommentId(null)
      } else {
        setDeleteError('비밀번호가 올바르지 않습니다.')
      }
    } catch {
      setDeleteError('삭제 중 오류가 발생했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-stardust-gray">
        아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={onDeleteComment ? handleDeleteClick : undefined}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="댓글 삭제"
      >
        <p className="text-stardust-gray mb-4">
          댓글을 삭제하려면 작성 시 입력한 비밀번호를 입력하세요.
        </p>
        <Input
          type="password"
          placeholder="비밀번호"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          error={deleteError}
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
            취소
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            isLoading={isDeleting}
            disabled={!deletePassword}
          >
            삭제
          </Button>
        </div>
      </Modal>
    </>
  )
}
