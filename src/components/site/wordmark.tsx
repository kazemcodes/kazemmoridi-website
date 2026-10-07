import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={cn("flex items-center gap-3", className)}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-ember text-lg font-bold text-primary-foreground shadow-ember">KM</span>
      <span className="text-xl font-bold">Studio.</span>
    </span>
  );
}
