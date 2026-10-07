import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { contact, socials } from "@/content/studio";
import { useLocale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

export function ContactChannels() {
  const locale = useLocale();
  const fa = locale === "fa";

  const primaryChannels = [
    {
      id: "bale",
      title: fa ? "پیام در بله" : "Message on Bale",
      subtitle: "@kazem_moridi",
      badge: fa ? "سریع‌ترین پاسخ" : "Fastest reply",
      href: contact.bale,
      icon: MessageCircle,
      accent: true,
    },
    {
      id: "telegram",
      title: fa ? "تلگرام" : "Telegram",
      subtitle: "@I_am_kazem",
      badge: fa ? "گفتگوی مستقیم" : "Direct chat",
      href: contact.telegram,
      icon: Send,
    },
    {
      id: "whatsapp",
      title: fa ? "واتساپ" : "WhatsApp",
      subtitle: contact.phoneDisplay[locale],
      badge: fa ? "ارسال پیام" : "Quick message",
      href: contact.whatsapp,
      icon: MessageCircle,
    },
    {
      id: "phone",
      title: fa ? "تماس تلفنی" : "Phone call",
      subtitle: contact.phoneDisplay[locale],
      badge: contact.hours[locale],
      href: `tel:${contact.phone}`,
      icon: Phone,
    },
    {
      id: "email",
      title: fa ? "ایمیل استودیو" : "Studio email",
      subtitle: contact.email,
      badge: fa ? "مکاتبات رسمی" : "Formal inquiries",
      href: `mailto:${contact.email}`,
      icon: Mail,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {primaryChannels.map((ch) => {
          const Icon = ch.icon;
          const external = ch.href.startsWith("http");
          return (
            <a
              key={ch.id}
              href={ch.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className={cn(
                "group relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1",
                ch.accent
                  ? "border-ember/30 bg-ember/5 hover:border-ember hover:shadow-ember"
                  : "border-line bg-surface hover:border-ember/40 hover:bg-card hover:shadow-soft",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-2xl transition-colors",
                    ch.accent
                      ? "bg-ember text-primary-foreground"
                      : "bg-card text-ember group-hover:bg-ember group-hover:text-primary-foreground",
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember" />
              </div>

              <div className="mt-6">
                <span className="inline-block rounded-full bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground">
                  {ch.badge}
                </span>
                <div className="mt-2 font-bold text-foreground">{ch.title}</div>
                <div dir="ltr" className="mt-1 truncate text-start text-xs text-muted-foreground">
                  {ch.subtitle}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface/60 px-6 py-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-6">
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-ember" />
            {contact.hours[locale]}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-ember" />
            {contact.location[locale]}
          </span>
        </div>
        <ul className="flex flex-wrap items-center gap-2">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border border-line bg-background px-3.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-ember hover:text-ember"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
