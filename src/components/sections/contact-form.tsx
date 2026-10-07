import { useState } from "react";
import { z } from "zod";
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
    "peer w-full border-0 border-b border-line bg-transparent pb-3 pt-7 text-lg outline-none transition-colors placeholder:text-transparent focus:border-ember";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea name={name} required={required} rows={4} placeholder={label} className={cn(cls, "resize-none")} maxLength={4000} />
      ) : (
        <input name={name} required={required} placeholder={label} className={cls} maxLength={160} />
      )}
      <span className="pointer-events-none absolute start-0 top-0 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </label>
  );
}

export function ContactForm() {
  const locale = useLocale();
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

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <div className="grid gap-10 md:grid-cols-2">
        <Field name="name" label={d.contact.name[locale]} required />
        <Field name="contact" label={d.contact.email[locale]} required />
      </div>
      <Field name="budget" label={d.contact.budget[locale]} />
      <Field name="message" label={d.contact.message[locale]} textarea required />
      <div className="flex flex-wrap items-center gap-6">
        <StudioButton type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? d.contact.sending[locale] : d.contact.send[locale]}
        </StudioButton>
        {status === "sent" && <p className="text-sm text-ember" role="status">{d.contact.sent[locale]}</p>}
        {status === "failed" && <p className="text-sm text-destructive" role="alert">{d.contact.failed[locale]}</p>}
      </div>
    </form>
  );
}
