import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const studioButton = cva(
  "group relative inline-flex items-center justify-center gap-3 rounded-2xl font-bold transition-[background,color,box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        ember: "bg-ember text-primary-foreground shadow-ember hover:brightness-95",
        bone: "bg-foreground text-background shadow-soft hover:bg-foreground/90",
        line: "border-2 border-line bg-background text-foreground hover:border-ember/40",
        ghost: "text-muted-foreground hover:text-ember",
      },
      size: {
        sm: "h-10 rounded-xl px-5 text-sm",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-lg",
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
