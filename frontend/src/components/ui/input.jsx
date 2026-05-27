import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, style, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full rounded-md border border-gray-200 bg-white text-sm outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ padding: "0 12px", ...style }}
      {...props}
    />
  )
}

export { Input }
