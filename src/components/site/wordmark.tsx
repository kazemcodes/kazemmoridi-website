import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={cn("flex items-center gap-3", className)}>
      <img src={logo} alt="KM Studio" width={40} height={40} className="h-10 w-10 object-contain" />
      <span className="text-xl font-bold">Studio.</span>
    </span>
  );
}
