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
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-silver-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-500 hover:to-gray-700 hover:scale-105 hover:shadow-glow-dark dark:from-silver-400 dark:to-silver-500 dark:text-dark-950 dark:hover:from-silver-300 dark:hover:to-silver-400 dark:hover:shadow-glow active:scale-100 font-semibold':
              variant === 'primary',
            'bg-gray-200 text-gray-900 border border-gray-400 hover:bg-gray-300 hover:scale-105 hover:shadow-glow-dark active:scale-100 dark:bg-zinc-800 dark:text-silver-300 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:shadow-glow':
              variant === 'secondary',
            'bg-transparent text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-silver-300 dark:hover:bg-zinc-800 dark:hover:text-white':
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
