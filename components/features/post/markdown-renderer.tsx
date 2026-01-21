'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import 'highlight.js/styles/github-dark.css'

export interface MarkdownRendererProps {
  content: string
  className?: string
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
      aria-label="코드 복사"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 text-stardust-gray" />
      )}
    </button>
  )
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <article
      className={cn(
        'prose prose-invert prose-lg max-w-none',
        // Headings
        'prose-headings:text-white prose-headings:font-bold',
        'prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2',
        'prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3',
        // Links
        'prose-a:text-primary-blue prose-a:no-underline hover:prose-a:underline',
        // Paragraphs
        'prose-p:text-stardust-gray prose-p:leading-relaxed',
        // Lists
        'prose-li:text-stardust-gray prose-li:marker:text-primary-blue',
        // Code
        'prose-code:text-primary-blue prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none',
        // Blockquote
        'prose-blockquote:border-l-4 prose-blockquote:border-primary-purple prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:text-stardust-gray prose-blockquote:not-italic',
        // Strong
        'prose-strong:text-white',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={{
          pre({ children, ...props }) {
            // Extract code text for copy button
            let codeText = ''
            if (children && typeof children === 'object' && 'props' in children) {
              const childProps = children.props as { children?: string }
              if (typeof childProps.children === 'string') {
                codeText = childProps.children
              }
            }

            return (
              <div className="relative group not-prose">
                <pre
                  className="bg-deep-navy border border-white/10 rounded-lg p-4 overflow-x-auto"
                  {...props}
                >
                  {children}
                </pre>
                <CopyButton code={codeText} />
              </div>
            )
          },
          img({ src, alt }) {
            return (
              <span className="block my-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt || ''}
                  className="rounded-lg max-w-full h-auto mx-auto"
                  loading="lazy"
                />
                {alt && (
                  <span className="block text-center text-sm text-stardust-gray mt-2">
                    {alt}
                  </span>
                )}
              </span>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
