import { useState } from "react";
import { z } from "zod";
import { PenLine, CheckCircle2 } from "lucide-react";
import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { getBackend } from "@/infrastructure";
import { StudioButton } from "@/components/primitives/button";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(3).max(160),
  budget: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1).max(4000),
});

type Status = "idle" | "sending" | "sent" | "failed";

function Field({ label, name, textarea, required }: { label: string; name: string; textarea?: boolean; required?: boolean }) {
  const cls =
    "peer w-full rounded-2xl border border-line bg-background px-5 pb-3 pt-7 text-base outline-none transition-all placeholder:text-transparent focus:border-ember focus:ring-4 focus:ring-ember/10";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea name={name} required={required} rows={5} placeholder={label} className={cn(cls, "resize-none")} maxLength={4000} />
      ) : (
        <input name={name} required={required} placeholder={label} className={cls} maxLength={160} />
      )}
      <span className="pointer-events-none absolute start-5 top-2.5 text-xs text-muted-foreground transition-colors peer-focus:text-ember">
        {label}
        {required && <span className="text-ember"> *</span>}
      </span>
    </label>
  );
}

export function ContactForm() {
  const locale = useLocale();
  const fa = locale === "fa";
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = schema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) return;
    setStatus("sending");
    try {
      await getBackend().messages.submit({ ...parsed.data, budget: parsed.data.budget || undefined, locale });
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex h-full min-h-96 flex-col items-center justify-center rounded-3xl border border-line bg-surface p-10 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-ember/10 text-ember">
          <CheckCircle2 className="size-8" strokeWidth={1.6} />
        </span>
        <p className="mt-6 text-xl font-semibold">{d.contact.sent[locale]}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-muted-foreground underline underline-offset-4 hover:text-ember"
        >
          {fa ? "ارسال پیام جدید" : "Send another message"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-surface p-6 md:p-10">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-ember/10 text-ember">
          <PenLine className="size-5" strokeWidth={1.8} />
        </span>
        <div>
          <div className="font-semibold">{fa ? "نامه‌ای برای استودیو" : "A letter to the studio"}</div>
          <div className="text-sm text-muted-foreground">
            {fa ? "هرچه دقیق‌تر بنویسید، پاسخ دقیق‌تری می‌گیرید." : "The more detail you share, the sharper our reply."}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field name="name" label={d.contact.name[locale]} required />
        <Field name="contact" label={d.contact.email[locale]} required />
      </div>
      <div className="mt-5">
        <Field name="budget" label={d.contact.budget[locale]} />
      </div>
      <div className="mt-5">
        <Field name="message" label={d.contact.message[locale]} textarea required />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <StudioButton type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? d.contact.sending[locale] : d.contact.send[locale]}
        </StudioButton>
        {status === "failed" && (
          <p className="text-sm text-destructive" role="alert">
            {d.contact.failed[locale]}
          </p>
        )}
      </div>
    </form>
  );
}
