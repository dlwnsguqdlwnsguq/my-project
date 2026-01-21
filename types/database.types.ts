/**
 * Supabase Database Types
 * Based on DATA_MODEL.md specification
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string | null
          content: string | null
          thumbnail_url: string | null
          description: string | null
          is_published: boolean
          is_featured: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug?: string | null
          content?: string | null
          thumbnail_url?: string | null
          description?: string | null
          is_published?: boolean
          is_featured?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string | null
          content?: string | null
          thumbnail_url?: string | null
          description?: string | null
          is_published?: boolean
          is_featured?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      posts_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          parent_id: string | null
          nickname: string
          password_hash: string | null
          content: string
          is_admin: boolean
          ip_address: string | null
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          post_id: string
          parent_id?: string | null
          nickname: string
          password_hash?: string | null
          content: string
          is_admin?: boolean
          ip_address?: string | null
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          parent_id?: string | null
          nickname?: string
          password_hash?: string | null
          content?: string
          is_admin?: boolean
          ip_address?: string | null
          created_at?: string
          deleted_at?: string | null
        }
      }
      admin_sessions: {
        Row: {
          id: string
          token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          token?: string
          expires_at?: string
          created_at?: string
        }
      }
    }
  }
}
