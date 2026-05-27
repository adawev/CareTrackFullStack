import { cn } from "@/lib/utils"

const variants = {
  default: "bg-gray-900 text-white",
  secondary: "bg-gray-100 text-gray-700",
  outline: "border border-gray-200 text-gray-700",
  destructive: "bg-red-100 text-red-700",
}

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", variants[variant] || variants.default, className)}
      {...props}
    />
  )
}

export { Badge }
