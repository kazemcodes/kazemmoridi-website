import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { getBackend } from "@/infrastructure";
import { useAdminSession } from "@/features/admin/use-admin-session";
import { StudioButton } from "@/components/primitives/button";
import { TextField } from "@/components/admin/fields";
import { Wordmark } from "@/components/site/wordmark";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "پنل مدیریت — KM Studio" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "داشبورد" },
  { to: "/admin/messages", label: "پیام‌ها" },
  { to: "/admin/clients", label: "مشتریان" },
  { to: "/admin/invoices", label: "فاکتورها" },
  { to: "/admin/letters", label: "نامه‌ها" },
  { to: "/admin/settings", label: "تنظیمات" },
] as const;

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="grid min-h-screen place-items-center bg-background p-6">
      <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-8">
        <Wordmark className="mb-8" />
        {children}
      </div>
    </div>
  );
}

function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await getBackend().auth.signIn(String(f.get("email")), String(f.get("password")));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Centered>
      <h1 className="mb-6 text-2xl">ورود به پنل مدیریت</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField label="ایمیل" name="email" type="email" required dir="ltr" autoComplete="email" />
        <TextField label="رمز عبور" name="password" type="password" required dir="ltr" autoComplete="current-password" />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <StudioButton type="submit" className="w-full" disabled={busy}>
          {busy ? "در حال ورود…" : "ورود"}
        </StudioButton>
      </form>
    </Centered>
  );
}

function AdminLayout() {
  const session = useAdminSession();

  if (session.status === "loading") return <Centered><p className="text-muted-foreground">در حال بارگذاری…</p></Centered>;
  if (session.status === "unconfigured")
    return (
      <Centered>
        <h1 className="text-xl">اتصال به Supabase تنظیم نشده</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          مقادیر VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY پروژه Supabase خود را اضافه کنید و فایل supabase/km-studio-security.sql را اجرا کنید.
        </p>
      </Centered>
    );
  if (session.status === "signed-out") return <SignIn />;
  if (session.status === "forbidden")
    return (
      <Centered>
        <h1 className="text-xl">دسترسی مجاز نیست</h1>
        <p className="mt-3 text-sm text-muted-foreground" dir="ltr">{session.user.email}</p>
        <p className="mt-2 text-sm text-muted-foreground">این حساب در جدول admins ثبت نشده است.</p>
        <StudioButton variant="line" className="mt-6" onClick={() => getBackend().auth.signOut()}>خروج</StudioButton>
      </Centered>
    );

  return (
    <div dir="rtl" className="min-h-screen bg-background md:grid md:grid-cols-[240px_1fr]">
      <aside className="no-print border-b border-line p-4 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-e md:p-6">
        <Link to="/admin"><Wordmark /></Link>
        <nav className="mt-6 flex gap-1 overflow-x-auto md:mt-10 md:flex-col">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/admin" }}
              className="whitespace-nowrap rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              activeProps={{ className: cn("!bg-ember-soft !text-ember") }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 hidden text-xs text-muted-foreground md:absolute md:bottom-6 md:block">
          <p dir="ltr" className="truncate">{session.user.email}</p>
          <button className="mt-2 hover:text-ember" onClick={() => getBackend().auth.signOut()}>خروج</button>
        </div>
      </aside>
      <main className="p-5 md:p-10">
        <Outlet />
      </main>
      <Toaster position="bottom-left" />
    </div>
  );
}
