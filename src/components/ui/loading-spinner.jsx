import { cn } from "../../lib/utils"

export function LoadingSpinner({ className, size = "default" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  )
}

export function LoadingCard({ className }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-muted rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
            <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LoadingSkeleton({ className, lines = 3 }) {
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted-foreground/20 rounded"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  )
}
