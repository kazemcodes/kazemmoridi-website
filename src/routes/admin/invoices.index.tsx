import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { Invoice } from "@/domain/types";
import { useRepo } from "@/features/admin/queries";
import { invoiceStatus, invoiceType } from "@/features/admin/labels";
import { formatToman } from "@/lib/persian";
import { DataTable, EmptyState, PageTitle } from "@/components/admin/fields";
import { StudioButton } from "@/components/primitives/button";

export const Route = createFileRoute("/admin/invoices/")({ component: InvoicesPage });

function InvoicesPage() {
  const list = useRepo<Invoice>("invoices").useList();
  const navigate = useNavigate();
  return (
    <>
      <PageTitle
        title="فاکتورها"
        actions={
          <StudioButton asChild size="sm">
            <Link to="/admin/invoices/$id" params={{ id: "new" }}>فاکتور جدید</Link>
          </StudioButton>
        }
      />
      {list.data?.length ? (
        <DataTable
          rows={list.data}
          onRowClick={(r) => navigate({ to: "/admin/invoices/$id", params: { id: r.id } })}
          columns={[
            { header: "شماره", cell: (r) => r.invoiceNumber },
            { header: "نوع", cell: (r) => invoiceType[r.type] },
            { header: "خریدار", cell: (r) => r.buyerName },
            { header: "تاریخ", cell: (r) => r.issueDate },
            { header: "مبلغ (ریال)", cell: (r) => formatToman(r.totalAmount) },
            { header: "وضعیت", cell: (r) => invoiceStatus[r.status] },
          ]}
        />
      ) : (
        <EmptyState>{list.isLoading ? "در حال بارگذاری…" : "فاکتوری ثبت نشده."}</EmptyState>
      )}
    </>
  );
}
