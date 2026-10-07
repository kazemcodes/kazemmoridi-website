import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { StudioProfile } from "@/domain/types";
import { useProfile } from "@/features/admin/queries";
import { StudioButton } from "@/components/primitives/button";

/** A4 paper frame shared by invoice and letter print views. */
export function PrintSheet({ back, children }: { back: { to: string; label: string }; children: (p: StudioProfile | null) => ReactNode }) {
  const profile = useProfile().query.data ?? null;
  return (
    <div>
      <div className="no-print mb-6 flex gap-2">
        <StudioButton size="sm" onClick={() => window.print()}>چاپ / PDF</StudioButton>
        <StudioButton asChild size="sm" variant="line">
          <Link to={back.to}>{back.label}</Link>
        </StudioButton>
      </div>
      <div className="mx-auto min-h-[297mm] w-full max-w-[210mm] bg-paper p-[14mm] text-paper-ink shadow-ember print:shadow-none">
        <header className="mb-8 flex items-start justify-between border-b-2 border-ember pb-6">
          <div>
            <div className="font-display text-2xl font-bold">{profile?.brandName ?? "KM Studio"}</div>
            <div className="mt-1 text-xs opacity-70">{profile?.address}</div>
          </div>
          <div className="text-start text-xs leading-6 opacity-80" dir="ltr">
            <div>{profile?.phoneDisplay}</div>
            <div>{profile?.email}</div>
            <div>{profile?.website}</div>
          </div>
        </header>
        {children(profile)}
      </div>
    </div>
  );
}
