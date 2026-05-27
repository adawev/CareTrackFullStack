import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

function Dialog({ open, onOpenChange, children }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => onOpenChange(false)}
          />
          <div className="relative z-50 w-full max-w-md">
            {React.Children.map(children, (child) =>
              child?.type === DialogContent
                ? React.cloneElement(child, { onClose: () => onOpenChange(false) })
                : child
            )}
          </div>
        </div>
      )}
    </>
  )
}

function DialogContent({ className, children, onClose }) {
  return (
    <div className={cn("bg-white rounded-xl shadow-xl border border-gray-200 p-6 mx-4", className)}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
      {children}
    </div>
  )
}

function DialogHeader({ className, ...props }) {
  return <div className={cn("mb-4", className)} {...props} />
}

function DialogTitle({ className, ...props }) {
  return <h2 className={cn("text-base font-semibold text-gray-900", className)} {...props} />
}

function DialogFooter({ className, ...props }) {
  return <div className={cn("flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100", className)} {...props} />
}

function DialogDescription({ className, ...props }) {
  return <p className={cn("text-sm text-gray-500 mt-1", className)} {...props} />
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription }
