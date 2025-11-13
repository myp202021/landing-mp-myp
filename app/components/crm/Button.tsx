import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-400 shadow-md hover:shadow-lg',
    secondary: 'bg-slate-600 text-white hover:bg-slate-500 shadow-md hover:shadow-lg',
    danger: 'bg-red-600 text-white hover:bg-red-500 shadow-md hover:shadow-lg',
    success: 'bg-green-600 text-white hover:bg-green-500 shadow-md hover:shadow-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
