import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white hover:bg-gray-800",
        outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-900",
        ghost: "hover:bg-gray-100 text-gray-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        link: "text-gray-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants }
