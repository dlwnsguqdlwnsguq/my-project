import { Container } from '@/components/layout/container'
import { PostList } from '@/components/features/post/post-list'
import { createClient } from '@/lib/supabase/server'
import type { PostListItem } from '@/types/model'

export const revalidate = 0

async function getPosts(): Promise<PostListItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      created_at,
      posts_tags (
        tags (
          id,
          name
        )
      )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return (data || []).map((post: any) => ({
    id: post.id,
    title: post.title,
    description: post.description,
    thumbnailUrl: post.thumbnail_url,
    createdAt: new Date(post.created_at),
    tags: post.posts_tags.map((pt: any) => pt.tags).filter(Boolean),
  }))
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen py-12">
      <Container>
        <PostList posts={posts} />
      </Container>
    </div>
  )
}

