'use client'

import { useState } from 'react'
import { CommentList } from '@/components/features/comment/comment-list'
import { CommentForm } from '@/components/features/comment/comment-form'
import type { Comment } from '@/types/model'

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  const handleSubmitComment = async (data: {
    nickname: string
    password: string
    content: string
  }) => {
    // In real app, this would be a server action
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      parentId: null,
      nickname: data.nickname,
      content: data.content,
      isAdmin: false,
      createdAt: new Date(),
    }

    setComments((prev) => [...prev, newComment])
    return true
  }

  const handleDeleteComment = async (commentId: string, password: string) => {
    // In real app, this would verify password via server action
    // For demo, just remove the comment
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    return true
  }

  return (
    <div className="space-y-8">
      {/* Comment Form */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">댓글 작성</h3>
        <CommentForm postId={postId} onSubmit={handleSubmitComment} />
      </div>

      {/* Comment List */}
      <CommentList comments={comments} onDeleteComment={handleDeleteComment} />
    </div>
  )
}
