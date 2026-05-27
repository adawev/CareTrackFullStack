import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

function Select({ value, onValueChange, children, defaultValue }) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

const SelectContext = React.createContext({})

function SelectTrigger({ className, children, ...props }) {
  const { value } = React.useContext(SelectContext)
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white text-sm transition-colors hover:border-gray-300 cursor-pointer",
        className
      )}
      style={{ padding: "0 12px" }}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-4 w-4 text-gray-400 shrink-0" />
    </div>
  )
}

function SelectValue({ placeholder }) {
  const { value } = React.useContext(SelectContext)
  return <span className={value ? "text-gray-900" : "text-gray-400"}>{value || placeholder}</span>
}

function SelectContent({ children }) {
  return null // handled by NativeSelect
}

function SelectItem({ value, children }) {
  return null // handled by NativeSelect
}

// The actual working component used in forms
function NativeSelect({ value, onValueChange, options, className, style }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          "h-10 w-full appearance-none rounded-md border border-gray-200 bg-white text-sm text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-100",
          className
        )}
        style={{ padding: "0 36px 0 12px", ...style }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  NativeSelect,
}
