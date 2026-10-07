import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={cn("flex items-center gap-2 font-display text-base font-semibold", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-full bg-ember text-[11px] text-primary-foreground">KM</span>
      <span>
        KM<span className="text-ember">.</span>Studio
      </span>
    </span>
  );
}
