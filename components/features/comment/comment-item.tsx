import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'
import type { Comment } from '@/types/model'

export interface CommentItemProps {
  comment: Comment
  onReply?: (commentId: string) => void
  onDelete?: (commentId: string) => void
}

export function CommentItem({ comment, onReply, onDelete }: CommentItemProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg',
        comment.isAdmin
          ? 'bg-primary-purple/10 border border-primary-purple/30'
          : 'bg-white/5 border border-white/10'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium text-white">{comment.nickname}</span>
        {comment.isAdmin && (
          <Badge variant="admin" size="sm">
            Admin
          </Badge>
        )}
        <span className="text-xs text-stardust-gray">
          {formatRelativeTime(comment.createdAt)}
        </span>
      </div>

      {/* Content */}
      <p className="text-stardust-gray whitespace-pre-wrap break-words">
        {comment.content}
      </p>

      {/* Actions */}
      <div className="flex gap-3 mt-3">
        {onReply && (
          <button
            onClick={() => onReply(comment.id)}
            className="text-xs text-stardust-gray hover:text-primary-blue transition-colors"
          >
            답글
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-xs text-stardust-gray hover:text-accent-pink transition-colors"
          >
            삭제
          </button>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-4 pl-4 border-l border-white/10 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
