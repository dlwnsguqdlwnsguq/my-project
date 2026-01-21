'use client'

import { motion } from 'framer-motion'
import { PostCard } from './post-card'
import type { PostListItem } from '@/types/model'

export interface PostListProps {
  posts: PostListItem[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-stardust-gray text-lg">아직 작성된 글이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <PostCard post={post} />
        </motion.div>
      ))}
    </div>
  )
}
