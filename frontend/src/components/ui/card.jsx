import { cn } from "@/lib/utils"

function Card({ className, ...props }) {
  return <div className={cn("bg-white rounded-xl border border-gray-200 shadow-sm", className)} {...props} />
}
function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-row items-center justify-between p-5 pb-3", className)} {...props} />
}
function CardTitle({ className, ...props }) {
  return <div className={cn("text-sm font-medium text-gray-500", className)} {...props} />
}
function CardContent({ className, ...props }) {
  return <div className={cn("px-5 pb-5", className)} {...props} />
}
function CardFooter({ className, ...props }) {
  return <div className={cn("px-5 py-3 border-t border-gray-100", className)} {...props} />
}
function CardDescription({ className, ...props }) {
  return <div className={cn("text-xs text-gray-400", className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription }
