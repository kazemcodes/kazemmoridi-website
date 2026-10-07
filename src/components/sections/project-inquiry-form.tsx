import { useState } from "react";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { getBackend } from "@/infrastructure";
import { StudioButton } from "@/components/primitives/button";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(3).max(160),
  budget: z.string().trim().max(80).optional(),
  timeline: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1).max(4000),
});

type Status = "idle" | "sending" | "sent" | "failed";

function InquiryField({
  label,
  name,
  textarea,
  required,
}: {
  label: string;
  name: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const cls =
    "peer w-full rounded-2xl border border-line bg-surface px-4 pb-2.5 pt-6 text-sm text-foreground outline-none transition-all placeholder:text-transparent focus:border-ember focus:bg-background focus:ring-4 focus:ring-ember/10";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={4}
          placeholder={label}
          className={cn(cls, "resize-none")}
          maxLength={4000}
        />
      ) : (
        <input name={name} required={required} placeholder={label} className={cls} maxLength={160} />
      )}
      <span className="pointer-events-none absolute start-4 top-2 text-xs text-muted-foreground transition-colors peer-focus:text-ember">
        {label}
        {required && <span className="text-ember"> *</span>}
      </span>
    </label>
  );
}

export function ProjectInquiryForm() {
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
      await getBackend().messages.submit({
        name: parsed.data.name,
        contact: parsed.data.contact,
        budget: parsed.data.budget || undefined,
        timeline: parsed.data.timeline || undefined,
        message: parsed.data.message,
        locale,
      });
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl bg-background p-8 text-center text-foreground shadow-soft md:p-10">
        <span className="grid size-14 place-items-center rounded-full bg-ember/10 text-ember">
          <CheckCircle2 className="size-7" strokeWidth={1.8} />
        </span>
        <p className="mt-5 text-lg font-semibold">{d.contact.sent[locale]}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm text-muted-foreground underline underline-offset-4 hover:text-ember"
        >
          {fa ? "ارسال درخواست جدید" : "Send another inquiry"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-background p-6 text-foreground shadow-soft md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <InquiryField name="name" label={d.contact.name[locale]} required />
        <InquiryField name="contact" label={d.contact.email[locale]} required />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <InquiryField name="budget" label={d.contact.budget[locale]} />
        <InquiryField name="timeline" label={d.contact.timeline[locale]} />
      </div>
      <div className="mt-4">
        <InquiryField name="message" label={d.contact.note[locale]} textarea required />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
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
