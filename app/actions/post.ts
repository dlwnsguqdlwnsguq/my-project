'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getAdminPosts() {
  const supabase = createAdminClient()
  
  // Service Role Key client bypasses RLS
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      posts_tags (
        tags (*)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin posts:', error)
    throw new Error('포스트 목록을 불러오는데 실패했습니다.')
  }

  // Map to frontend model
  return (data || []).map((post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    thumbnailUrl: post.thumbnail_url,
    description: post.description,
    isPublished: post.is_published,
    isFeatured: post.is_featured,
    viewCount: post.view_count,
    createdAt: new Date(post.created_at),
    updatedAt: new Date(post.updated_at),
    tags: post.posts_tags ? post.posts_tags.map((pt: any) => pt.tags).filter(Boolean) : [],
  }))
}

export async function createPost(
  title: string,
  content: string,
  tags: string[],
  isPublished: boolean
) {
  const supabase = createAdminClient()

  // 1. Create Post
  const { data: post, error: postError } = await (supabase.from('posts') as any)
    .insert({
      title,
      content,
      is_published: isPublished,
      description: content.slice(0, 150) + '...', // Simple auto description
    })
    .select()
    .single()

  if (postError) {
    console.error('Create post error:', postError)
    throw new Error('글 작성에 실패했습니다.')
  }

  // 2. Process Tags
  if (tags.length > 0) {
    for (const tagName of tags) {
      const trimmedName = tagName.trim()
      if (!trimmedName) continue

      // Find or create tag
      let tagId
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', trimmedName)
        .single()

      if (existingTag) {
        tagId = (existingTag as any).id
      } else {
        const { data: newTag, error: tagError } = await (supabase.from('tags') as any)
          .insert({ name: trimmedName })
          .select()
          .single()
        
        if (tagError) continue
        tagId = newTag.id
      }

      // Link post and tag
      await (supabase.from('posts_tags') as any)
        .insert({ post_id: post.id, tag_id: tagId })
    }
  }

  revalidatePath('/admin/dashboard')
  revalidatePath('/')
  revalidatePath('/posts')
  
  return { success: true }
}

export async function deletePost(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  
  if (error) {
    console.error('Delete error:', error)
    throw new Error('삭제 실패')
  }
  
  revalidatePath('/admin/dashboard')
  revalidatePath('/')
  revalidatePath('/posts')
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  const supabase = createAdminClient()
  const { error } = await (supabase.from('posts') as any)
    .update({ is_featured: isFeatured })
    .eq('id', id)

  if (error) throw error
  
  revalidatePath('/admin/dashboard')
  revalidatePath('/')
}

export async function togglePublished(id: string, isPublished: boolean) {
  const supabase = createAdminClient()
  const { error } = await (supabase.from('posts') as any)
    .update({ is_published: isPublished })
    .eq('id', id)

  if (error) throw error
  
  revalidatePath('/admin/dashboard')
  revalidatePath('/')
  revalidatePath('/posts')
}
