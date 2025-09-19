"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

const Toast = React.forwardRef(({ className, variant = "default", title, description, onClose, ...props }, ref) => {
  const variants = {
    default: "bg-background border-border",
    success: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
    error: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
    warning: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  }

  const icons = {
    default: Info,
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const Icon = icons[variant]

  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          {title && (
            <div className="text-sm font-semibold text-foreground">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
})
Toast.displayName = "Toast"

export { Toast }
