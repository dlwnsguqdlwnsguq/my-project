/**
 * Frontend Domain Models
 * Used for type-safe data handling in components
 */

export interface Tag {
  id: string
  name: string
}

export interface Post {
  id: string
  title: string
  slug: string | null
  content: string | null
  thumbnailUrl: string | null
  description: string | null
  isPublished: boolean
  isFeatured: boolean
  viewCount: number
  createdAt: Date
  updatedAt: Date
  tags: Tag[]
}

export interface PostListItem {
  id: string
  title: string
  thumbnailUrl: string | null
  description: string | null
  createdAt: Date
  tags: Tag[]
}

export interface Comment {
  id: string
  postId: string
  parentId: string | null
  nickname: string
  content: string
  isAdmin: boolean
  createdAt: Date
  replies?: Comment[]
}

export interface CommentFormData {
  nickname: string
  password: string
  content: string
  captchaAnswer: number
}

export interface TOCItem {
  id: string
  text: string
  level: number
}

export interface AdminSession {
  token: string
  expiresAt: Date
}
