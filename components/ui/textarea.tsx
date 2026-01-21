import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || props.name

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-stardust-gray mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5',
            'text-white placeholder:text-stardust-gray/60',
            'transition-all duration-200 resize-y min-h-[120px]',
            'focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-accent-pink focus:border-accent-pink focus:ring-accent-pink/50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-accent-pink">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
