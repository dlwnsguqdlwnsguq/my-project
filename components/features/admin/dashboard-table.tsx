'use client'

import Link from 'next/link'
import { Edit, Trash2, Eye, Star, StarOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils/date'
import type { Post } from '@/types/model'

export interface DashboardTableProps {
  posts: Post[]
  onDelete: (id: string) => void
  onToggleFeatured: (id: string, isFeatured: boolean) => void
}

export function DashboardTable({
  posts,
  onDelete,
  onToggleFeatured,
}: DashboardTableProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-stardust-gray">
        아직 작성된 글이 없습니다.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-sm font-medium text-stardust-gray">
              제목
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-stardust-gray hidden md:table-cell">
              상태
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-stardust-gray hidden sm:table-cell">
              조회수
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-stardust-gray hidden lg:table-cell">
              작성일
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-stardust-gray">
              액션
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  {post.isFeatured && (
                    <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  )}
                  <span className="text-white font-medium line-clamp-1">
                    {post.title}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 hidden md:table-cell">
                <Badge
                  variant={post.isPublished ? 'default' : 'admin'}
                  size="sm"
                >
                  {post.isPublished ? '발행됨' : '임시저장'}
                </Badge>
              </td>
              <td className="py-4 px-4 text-right text-stardust-gray hidden sm:table-cell">
                {post.viewCount.toLocaleString()}
              </td>
              <td className="py-4 px-4 text-right text-stardust-gray text-sm hidden lg:table-cell">
                {formatDate(post.createdAt)}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/posts/${post.id}`}>
                    <Button variant="ghost" size="sm" title="미리보기">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFeatured(post.id, !post.isFeatured)}
                    title={post.isFeatured ? '메인 해제' : '메인 설정'}
                  >
                    {post.isFeatured ? (
                      <StarOff className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                  </Button>
                  <Link href={`/admin/editor/${post.id}`}>
                    <Button variant="ghost" size="sm" title="수정">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(post.id)}
                    title="삭제"
                    className="hover:text-accent-pink"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
