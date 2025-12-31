import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-gradient-to-r from-silver-400 to-silver-600 text-dark-900 hover:from-silver-300 hover:to-silver-500 hover:scale-105 hover:shadow-glow active:scale-100 font-semibold':
              variant === 'primary',
            'bg-dark-800 text-silver-100 border border-silver-600 hover:bg-dark-700 hover:border-silver-400 hover:scale-105 hover:shadow-glow active:scale-100':
              variant === 'secondary',
            'bg-transparent text-silver-300 hover:bg-silver-700/20 hover:text-silver-100':
              variant === 'ghost',
          },
          {
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-6 text-base': size === 'md',
            'h-14 px-8 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
