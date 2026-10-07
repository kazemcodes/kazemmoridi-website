import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { OfficialLetter } from "@/domain/types";
import { newId } from "@/domain/invoice";
import { useRepo } from "@/features/admin/queries";
import { letterStatus, letterType, options } from "@/features/admin/labels";
import { todayJalali } from "@/lib/persian";
import { PageTitle, Panel, SelectField, TextArea, TextField } from "@/components/admin/fields";
import { StudioButton } from "@/components/primitives/button";

export const Route = createFileRoute("/admin/letters/$id")({ component: LetterEditor });

const blank = (): OfficialLetter => ({
  id: newId(),
  letterNumber: `KM/L-${Date.now().toString().slice(-5)}`,
  letterDate: todayJalali(),
  attachment: "ندارد",
  type: "official",
  subject: "",
  recipientTitle: "",
  body: "",
  signeeTitle: "مدیریت مهندسی و توسعه",
  signeeName: "کاظم مریدی",
  status: "draft",
});

function LetterEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const repo = useRepo<OfficialLetter>("letters");
  const existing = repo.useOne(isNew ? undefined : id);
  const navigate = useNavigate();
  const [l, setL] = useState<OfficialLetter | null>(isNew ? blank() : null);
  useEffect(() => {
    if (existing.data) setL(existing.data);
  }, [existing.data]);

  if (!l) return <p className="text-muted-foreground">در حال بارگذاری…</p>;
  const set = <K extends keyof OfficialLetter>(k: K, v: OfficialLetter[K]) => setL((d) => (d ? { ...d, [k]: v } : d));

  return (
    <>
      <PageTitle
        title={isNew ? "نامه جدید" : l.subject || l.letterNumber}
        actions={
          <div className="flex gap-2">
            {!isNew && (
              <StudioButton asChild size="sm" variant="line">
                <Link to="/admin/letter-print/$id" params={{ id: l.id }}>نسخه چاپی</Link>
              </StudioButton>
            )}
            {!isNew && (
              <StudioButton size="sm" variant="ghost" onClick={() => confirm("حذف شود؟") && repo.remove.mutate(l.id, { onSuccess: () => navigate({ to: "/admin/letters" }) })}>
                حذف
              </StudioButton>
            )}
            <StudioButton
              size="sm"
              disabled={repo.save.isPending}
              onClick={() => repo.save.mutate(l, { onSuccess: () => isNew && navigate({ to: "/admin/letters/$id", params: { id: l.id }, replace: true }) })}
            >
              ذخیره
            </StudioButton>
          </div>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="متن نامه" className="xl:col-span-2">
          <div className="space-y-4">
            <TextField label="موضوع" value={l.subject} onChange={(e) => set("subject", e.target.value)} />
            <TextField label="عنوان گیرنده" placeholder="ریاست محترم …" value={l.recipientTitle} onChange={(e) => set("recipientTitle", e.target.value)} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="نام گیرنده" value={l.recipientName ?? ""} onChange={(e) => set("recipientName", e.target.value)} />
              <TextField label="سازمان گیرنده" value={l.recipientCompany ?? ""} onChange={(e) => set("recipientCompany", e.target.value)} />
            </div>
            <TextArea label="متن" className="[&_textarea]:min-h-80" value={l.body} onChange={(e) => set("body", e.target.value)} />
          </div>
        </Panel>
        <Panel title="مشخصات">
          <div className="space-y-4">
            <TextField label="شماره" value={l.letterNumber} onChange={(e) => set("letterNumber", e.target.value)} />
            <TextField label="تاریخ" value={l.letterDate} onChange={(e) => set("letterDate", e.target.value)} />
            <TextField label="پیوست" value={l.attachment} onChange={(e) => set("attachment", e.target.value)} />
            <SelectField label="نوع" value={l.type} onChange={(v) => set("type", v)} options={options(letterType)} />
            <SelectField label="وضعیت" value={l.status} onChange={(v) => set("status", v)} options={options(letterStatus)} />
            <TextField label="سمت امضاکننده" value={l.signeeTitle} onChange={(e) => set("signeeTitle", e.target.value)} />
            <TextField label="نام امضاکننده" value={l.signeeName} onChange={(e) => set("signeeName", e.target.value)} />
          </div>
        </Panel>
      </div>
    </>
  );
}
