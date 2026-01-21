import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { MarkdownRenderer } from '@/components/features/post/markdown-renderer'
import { TOC } from '@/components/features/post/toc'
import { CommentSection } from './comment-section'
import { formatDate } from '@/lib/utils/date'
import { extractTOC } from '@/lib/utils/markdown'
import type { Post, Tag, Comment } from '@/types/model'

// Mock data - will be replaced with Supabase queries
const MOCK_POST: Post = {
  id: '1',
  title: 'Next.js 15에서 달라진 것들',
  slug: null,
  content: `## 소개

Next.js 15이 출시되었습니다. 이번 버전에서는 많은 변화가 있었는데요, 주요 변경사항들을 하나씩 살펴보겠습니다.

## 주요 변경사항

### 1. Turbopack 안정화

드디어 Turbopack이 안정화되었습니다. 개발 서버 시작 속도가 크게 향상되었습니다.

\`\`\`bash
npm run dev --turbo
\`\`\`

### 2. 향상된 캐싱

캐싱 메커니즘이 개선되어 더 효율적인 데이터 관리가 가능해졌습니다.

\`\`\`typescript
// 새로운 캐싱 패턴
import { unstable_cache } from 'next/cache'

const getCachedData = unstable_cache(
  async () => {
    return await fetchData()
  },
  ['my-cache-key'],
  { revalidate: 3600 }
)
\`\`\`

## 마무리

Next.js 15는 성능과 개발자 경험 모두를 크게 향상시켰습니다. 새 프로젝트를 시작한다면 적극 도입을 권장합니다.

> 더 자세한 내용은 [공식 문서](https://nextjs.org/docs)를 참고하세요.
`,
  thumbnailUrl: null,
  description: 'Next.js 15 버전의 주요 변경사항과 새로운 기능들을 살펴봅니다.',
  isPublished: true,
  isFeatured: true,
  viewCount: 1234,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  tags: [{ id: '2', name: 'Next.js' }, { id: '3', name: 'TypeScript' }],
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    postId: '1',
    parentId: null,
    nickname: '방문자1',
    content: '좋은 글 감사합니다! Next.js 15 업그레이드 고려 중이었는데 도움이 많이 됐어요.',
    isAdmin: false,
    createdAt: new Date('2024-01-16'),
  },
  {
    id: '2',
    postId: '1',
    parentId: null,
    nickname: 'Admin',
    content: '감사합니다! 궁금한 점 있으시면 댓글 남겨주세요.',
    isAdmin: true,
    createdAt: new Date('2024-01-16'),
  },
]

interface PostDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PostDetailPageProps) {
  const { id } = await params
  // In real app, fetch post from Supabase
  const post = MOCK_POST

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
  
  // In real app, fetch from Supabase
  const post = MOCK_POST
  const comments = MOCK_COMMENTS

  if (!post) {
    notFound()
  }

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
