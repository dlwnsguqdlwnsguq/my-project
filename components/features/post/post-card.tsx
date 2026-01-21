import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/date'
import type { PostListItem } from '@/types/model'

export interface PostCardProps {
  post: PostListItem
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <Card className="h-full overflow-hidden">
        {/* Thumbnail */}
        {post.thumbnailUrl && (
          <div className="relative aspect-video -mx-5 -mt-5 mb-4 overflow-hidden">
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 to-transparent" />
          </div>
        )}

        <CardContent>
          {/* Title */}
          <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-primary-blue transition-colors">
            {post.title}
          </h3>

          {/* Description */}
          {post.description && (
            <p className="mt-2 text-sm text-stardust-gray line-clamp-2">
              {post.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex-wrap">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 flex-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} size="sm">
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Date */}
          <time
            dateTime={post.createdAt.toISOString()}
            className="text-xs text-stardust-gray"
          >
            {formatDate(post.createdAt)}
          </time>
        </CardFooter>
      </Card>
    </Link>
  )
}
