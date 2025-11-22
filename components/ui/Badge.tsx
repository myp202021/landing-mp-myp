import * as React from "react"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: {
        backgroundColor: '#0f172a',
        color: 'white',
        border: '1px solid transparent'
      },
      secondary: {
        backgroundColor: '#f1f5f9',
        color: '#0f172a',
        border: '1px solid transparent'
      },
      destructive: {
        backgroundColor: '#dc2626',
        color: 'white',
        border: '1px solid transparent'
      },
      outline: {
        backgroundColor: 'transparent',
        color: '#0f172a',
        border: '1px solid #e2e8f0'
      }
    }

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: '9999px',
          padding: '2px 8px',
          fontSize: '12px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
          ...variants[variant],
          ...props.style
        }}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }