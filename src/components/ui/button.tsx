import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_2px_hsl(var(--primary)/0.3),0_4px_12px_-2px_hsl(var(--primary)/0.2)] hover:shadow-[0_1px_3px_hsl(var(--primary)/0.4),0_8px_20px_-4px_hsl(var(--primary)/0.25)] hover:brightness-110 rounded-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_1px_2px_hsl(var(--destructive)/0.3)] hover:shadow-[0_1px_3px_hsl(var(--destructive)/0.4),0_6px_16px_-4px_hsl(var(--destructive)/0.2)] hover:brightness-110 rounded-lg",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/20 rounded-lg shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
        premium:
          "bg-primary text-primary-foreground rounded-lg shadow-[0_1px_3px_hsl(var(--primary)/0.3),0_6px_20px_-4px_hsl(var(--primary)/0.25)] hover:shadow-[0_2px_6px_hsl(var(--primary)/0.4),0_12px_32px_-6px_hsl(var(--primary)/0.3)] hover:brightness-110",
        soft:
          "bg-primary/10 text-primary hover:bg-primary/15 rounded-lg font-medium",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-11 rounded-lg px-8 text-sm",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
