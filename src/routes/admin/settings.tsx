import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { StudioProfile } from "@/domain/types";
import { useProfile } from "@/features/admin/queries";
import { PageTitle, Panel, TextField } from "@/components/admin/fields";
import { StudioButton } from "@/components/primitives/button";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

const empty: StudioProfile = {
  brandName: "KM Studio — استودیو مریدی",
  managerName: "",
  nationalId: "",
  economicCode: "",
  registrationNumber: "",
  phone: "",
  phoneDisplay: "",
  email: "",
  website: "",
  shebaNumber: "",
  cardNumber: "",
  bankName: "",
  address: "",
  postalCode: "",
};

const FIELDS: { key: keyof StudioProfile; label: string; ltr?: boolean }[] = [
  { key: "brandName", label: "نام برند" },
  { key: "managerName", label: "نام مدیر" },
  { key: "nationalId", label: "شناسه ملی", ltr: true },
  { key: "economicCode", label: "کد اقتصادی", ltr: true },
  { key: "registrationNumber", label: "شماره ثبت", ltr: true },
  { key: "phone", label: "تلفن", ltr: true },
  { key: "phoneDisplay", label: "تلفن (نمایشی)" },
  { key: "email", label: "ایمیل", ltr: true },
  { key: "website", label: "وب‌سایت", ltr: true },
  { key: "bankName", label: "بانک" },
  { key: "cardNumber", label: "شماره کارت", ltr: true },
  { key: "shebaNumber", label: "شماره شبا", ltr: true },
  { key: "postalCode", label: "کد پستی", ltr: true },
  { key: "address", label: "آدرس" },
];

function SettingsPage() {
  const { query, save } = useProfile();
  const [p, setP] = useState<StudioProfile>(empty);
  useEffect(() => {
    if (query.data) setP(query.data);
  }, [query.data]);

  return (
    <>
      <PageTitle title="اطلاعات رسمی استودیو" actions={<StudioButton size="sm" onClick={() => save.mutate(p)} disabled={save.isPending}>ذخیره</StudioButton>} />
      <Panel>
        <div className="grid gap-4 md:grid-cols-2">
          {FIELDS.map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              dir={f.ltr ? "ltr" : undefined}
              value={(p[f.key] as string) ?? ""}
              onChange={(e) => setP((x) => ({ ...x, [f.key]: e.target.value }))}
            />
          ))}
        </div>
      </Panel>
    </>
  );
}
