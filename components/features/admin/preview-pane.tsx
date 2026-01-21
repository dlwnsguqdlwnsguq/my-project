import { MarkdownRenderer } from '@/components/features/post/markdown-renderer'

export interface PreviewPaneProps {
  content: string
  title?: string
}

export function PreviewPane({ content, title }: PreviewPaneProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-deep-navy/50">
        <span className="text-sm font-medium text-stardust-gray">미리보기</span>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {title && (
          <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>
        )}
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p className="text-stardust-gray/50 italic">
            왼쪽에서 마크다운을 입력하면 여기에 미리보기가 표시됩니다.
          </p>
        )}
      </div>
    </div>
  )
}
