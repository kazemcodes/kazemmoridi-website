import { createFileRoute } from "@tanstack/react-router";
import type { OfficialLetter } from "@/domain/types";
import { useRepo } from "@/features/admin/queries";
import { PrintSheet } from "@/components/admin/print-sheet";

export const Route = createFileRoute("/admin/letter-print/$id")({ component: LetterPrint });

function LetterPrint() {
  const { id } = Route.useParams();
  const { data: l } = useRepo<OfficialLetter>("letters").useOne(id);
  if (!l) return <p className="text-muted-foreground">در حال بارگذاری…</p>;

  return (
    <PrintSheet back={{ to: `/admin/letters/${l.id}`, label: "بازگشت" }}>
      {() => (
        <article className="text-sm leading-8">
          <div className="mb-10 ms-auto w-48 text-xs leading-6">
            <div>شماره: {l.letterNumber}</div>
            <div>تاریخ: {l.letterDate}</div>
            <div>پیوست: {l.attachment}</div>
          </div>
          <p className="font-bold">{l.recipientTitle}</p>
          {(l.recipientName || l.recipientCompany) && (
            <p>{[l.recipientName, l.recipientCompany].filter(Boolean).join(" — ")}</p>
          )}
          <p className="mt-4">با سلام و احترام،</p>
          <p className="mt-2 font-bold">موضوع: {l.subject}</p>
          <div className="mt-6 whitespace-pre-wrap text-justify">{l.body}</div>
          <div className="mt-16 ms-auto w-56 text-center">
            <div>{l.signeeName}</div>
            <div className="text-xs opacity-70">{l.signeeTitle}</div>
          </div>
        </article>
      )}
    </PrintSheet>
  );
}
