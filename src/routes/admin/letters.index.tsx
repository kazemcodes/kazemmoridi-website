import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { OfficialLetter } from "@/domain/types";
import { useRepo } from "@/features/admin/queries";
import { letterStatus, letterType } from "@/features/admin/labels";
import { DataTable, EmptyState, PageTitle } from "@/components/admin/fields";
import { StudioButton } from "@/components/primitives/button";

export const Route = createFileRoute("/admin/letters/")({ component: LettersPage });

function LettersPage() {
  const list = useRepo<OfficialLetter>("letters").useList();
  const navigate = useNavigate();
  return (
    <>
      <PageTitle
        title="نامه‌های رسمی"
        actions={
          <StudioButton asChild size="sm">
            <Link to="/admin/letters/$id" params={{ id: "new" }}>نامه جدید</Link>
          </StudioButton>
        }
      />
      {list.data?.length ? (
        <DataTable
          rows={list.data}
          onRowClick={(r) => navigate({ to: "/admin/letters/$id", params: { id: r.id } })}
          columns={[
            { header: "شماره", cell: (r) => r.letterNumber },
            { header: "موضوع", cell: (r) => r.subject },
            { header: "نوع", cell: (r) => letterType[r.type] },
            { header: "تاریخ", cell: (r) => r.letterDate },
            { header: "وضعیت", cell: (r) => letterStatus[r.status] },
          ]}
        />
      ) : (
        <EmptyState>{list.isLoading ? "در حال بارگذاری…" : "نامه‌ای ثبت نشده."}</EmptyState>
      )}
    </>
  );
}
