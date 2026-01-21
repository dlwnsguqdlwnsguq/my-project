import { Suspense } from 'react'
import { Container } from '@/components/layout/container'
import { PostList } from '@/components/features/post/post-list'
import { TagList } from '@/components/features/post/tag-list'
import { Loading } from '@/components/ui/loading'
import { createClient } from '@/lib/supabase/server'
import type { PostListItem, Tag } from '@/types/model'

export const metadata = {
  title: '글 목록',
  description: '모든 블로그 글 목록',
}

interface PostsPageProps {
  searchParams: Promise<{ tag?: string }>
}

async function getTags(): Promise<Tag[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('tags').select('*').order('name')
  return data || []
}

async function getPosts(tag?: string): Promise<PostListItem[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('posts')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      created_at,
      posts_tags!inner (
        tags (
          id,
          name
        )
      )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (tag) {
    // Filter by tag name through the joined relation
    // Note: The !inner on posts_tags above forces an inner join, 
    // effectively filtering posts that don't have the tag if we filter on tags.name
    // But Supabase syntax for deep filtering can be tricky.
    // simpler approach: Filter on the joined table
    query = query.eq('posts_tags.tags.name', tag)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  // Map DB response to Frontend Model
  return (data || []).map((post: any) => ({
    id: post.id,
    title: post.title,
    description: post.description,
    thumbnailUrl: post.thumbnail_url,
    createdAt: new Date(post.created_at),
    tags: post.posts_tags.map((pt: any) => pt.tags).filter(Boolean), // Flatten the nested structure
  }))
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams
  const activeTag = params.tag

  // Parallel data fetching
  const [tags, posts] = await Promise.all([
    getTags(),
    getPosts(activeTag)
  ])

  return (
    <div className="min-h-screen py-12">
      <Container size="md">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            글 목록
          </h1>
          <p className="text-stardust-gray">
            총 {posts.length}개의 글
          </p>
        </div>

        {/* Tag Filter */}
        <Suspense fallback={<Loading size="sm" />}>
          <TagList tags={tags} className="mb-8" />
        </Suspense>

        {/* Post List */}
        <PostList posts={posts} />
      </Container>
    </div>
  )
}
