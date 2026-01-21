import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/features/post/post-card'
import { createClient } from '@/lib/supabase/server'
import { SITE_CONFIG } from '@/lib/constants'
import type { PostListItem, Tag } from '@/types/model'

async function getRecentPosts(): Promise<PostListItem[]> {
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
    .limit(3)

  if (error) {
    console.error('Error fetching recent posts:', error)
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

async function getTags(): Promise<Tag[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('tags').select('*').limit(6)
  return data || []
}

export default async function HomePage() {
  const [posts, tags] = await Promise.all([
    getRecentPosts(),
    getTags(),
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <Container className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-blue/10 border border-primary-blue/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary-blue" />
            <span className="text-sm text-primary-blue">개발자 블로그</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            {SITE_CONFIG.slogan}
          </h1>

          <p className="text-lg md:text-xl text-stardust-gray max-w-2xl mx-auto mb-10">
            마크다운으로 기록하고, 우주를 탐험하듯 지식을 발견하세요.
            <br className="hidden md:block" />
            개발 여정의 모든 순간을 이곳에 남깁니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/posts">
              <Button size="lg">
                글 목록 보기
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#recent">
              <Button variant="ghost" size="lg">
                최근 글 보기
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Planet Menu (Tags) */}
      <section className="py-12 border-y border-white/5">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {tags.map((tag) => (
              <Link key={tag.id} href={`/posts?tag=${tag.name}`}>
                <div className="group relative px-6 py-4 rounded-full bg-white/5 border border-white/10 hover:border-primary-blue/50 hover:bg-primary-blue/5 transition-all duration-300 cursor-pointer">
                  <span className="text-white font-medium group-hover:text-primary-blue transition-colors">
                    {tag.name}
                  </span>
                  {/* Orbit ring effect */}
                  <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-primary-blue/20 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Recent Posts */}
      <section id="recent" className="py-16 md:py-24">
        <Container>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              최근 글
            </h2>
            <Link href="/posts">
              <Button variant="ghost" size="sm">
                전체 보기
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
