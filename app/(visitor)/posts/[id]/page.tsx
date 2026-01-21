import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { MarkdownRenderer } from '@/components/features/post/markdown-renderer'
import { TOC } from '@/components/features/post/toc'
import { CommentSection } from './comment-section'
import { formatDate } from '@/lib/utils/date'
import { extractTOC } from '@/lib/utils/markdown'
import { createClient } from '@/lib/supabase/server'
import type { Post, Comment } from '@/types/model'

interface PostDetailPageProps {
  params: Promise<{ id: string }>
}

async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient()
  
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      posts_tags (
        tags (*)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !post) {
    console.error('Error fetching post:', error)
    return null
  }

  // Map to frontend model
  return {
    id: (post as any).id,
    title: (post as any).title,
    slug: (post as any).slug,
    content: (post as any).content,
    thumbnailUrl: (post as any).thumbnail_url,
    description: (post as any).description,
    isPublished: (post as any).is_published,
    isFeatured: (post as any).is_featured,
    viewCount: (post as any).view_count,
    createdAt: new Date((post as any).created_at),
    updatedAt: new Date((post as any).updated_at),
    tags: (post as any).posts_tags.map((pt: any) => pt.tags).filter(Boolean),
  }
}

async function getComments(postId: string): Promise<Comment[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return (data || []).map((comment: any) => ({
    id: comment.id,
    postId: comment.post_id,
    parentId: comment.parent_id,
    nickname: comment.nickname,
    content: comment.content,
    isAdmin: comment.is_admin,
    createdAt: new Date(comment.created_at),
  }))
}

export async function generateMetadata({ params }: PostDetailPageProps) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    return { title: '글을 찾을 수 없습니다' }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
    },
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params
  
  // Parallel fetching
  const [post, comments] = await Promise.all([
    getPost(id),
    getComments(id),
  ])

  if (!post) {
    notFound()
  }

  // Increment view count (This is a side effect, might be better in a separate action or client-side effect, 
  // but for simple blog logic, trigger it here or rely on database triggers/edge functions if available.
  // We'll skip explicit increment for now to keep it pure server component read, or implement later)

  const tocItems = extractTOC(post.content || '')

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative py-16 md:py-24 border-b border-white/10">
        {post.thumbnailUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-space-black/50 via-space-black/80 to-space-black" />
          </div>
        )}
        <Container size="md" className="relative z-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-stardust-gray">
            <time dateTime={post.createdAt.toISOString()}>
              {formatDate(post.createdAt)}
            </time>
            <span>·</span>
            <span>{post.viewCount.toLocaleString()} views</span>
          </div>
        </Container>
      </div>

      {/* Content Area */}
      <Container size="md" className="py-12">
        <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
          {/* Main Content */}
          <article className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 md:p-10 border border-white/5">
            <MarkdownRenderer content={post.content || ''} />
          </article>

          {/* TOC Sidebar */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TOC items={tocItems} />
              </div>
            </aside>
          )}
        </div>

        {/* Comments */}
        <section className="mt-16 pt-12 border-t border-white/10">
          <h2 className="text-2xl font-bold text-white mb-8">
            댓글 {comments.length}개
          </h2>
          <CommentSection postId={post.id} initialComments={comments} />
        </section>
      </Container>
    </div>
  )
}
