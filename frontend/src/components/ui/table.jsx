import { cn } from "@/lib/utils"

function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  )
}
function TableHeader({ className, ...props }) {
  return <thead className={cn("border-b border-gray-100", className)} {...props} />
}
function TableBody({ className, ...props }) {
  return <tbody className={cn("divide-y divide-gray-50", className)} {...props} />
}
function TableRow({ className, ...props }) {
  return <tr className={cn("hover:bg-gray-50 transition-colors", className)} {...props} />
}
function TableHead({ className, ...props }) {
  return <th className={cn("h-10 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap", className)} {...props} />
}
function TableCell({ className, ...props }) {
  return <td className={cn("px-4 py-3 text-sm text-gray-700 whitespace-nowrap", className)} {...props} />
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
