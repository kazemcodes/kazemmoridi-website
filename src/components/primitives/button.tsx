import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const studioButton = cva(
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium transition-[background,color,box-shadow,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        ember: "bg-ember text-primary-foreground hover:shadow-ember",
        bone: "bg-bone text-background hover:bg-ember",
        line: "border border-line text-foreground hover:border-ember hover:text-ember",
        ghost: "text-muted-foreground hover:text-foreground",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-12 px-6 text-sm",
        lg: "h-16 px-8 text-base",
      },
    },
    defaultVariants: { variant: "ember", size: "md" },
  },
);

export interface StudioButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof studioButton> {
  asChild?: boolean;
}

export const StudioButton = forwardRef<HTMLButtonElement, StudioButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(studioButton({ variant, size }), className)} {...props} />;
  },
);
StudioButton.displayName = "StudioButton";
