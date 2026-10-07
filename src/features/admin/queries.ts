import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getBackend } from "@/infrastructure";
import type { CrudRepository } from "@/domain/ports";

type RepoKey = "clients" | "invoices" | "letters";

/** Generic list/get/save/remove hooks over any CrudRepository on the backend. */
export function useRepo<T extends { id: string }>(key: RepoKey) {
  const repo = getBackend()[key] as unknown as CrudRepository<T>;
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: [key] });

  return {
    useList: () => useQuery({ queryKey: [key], queryFn: () => repo.list() }),
    useOne: (id: string | undefined) =>
      useQuery({ queryKey: [key, id], queryFn: () => repo.get(id!), enabled: Boolean(id) }),
    save: useMutation({
      mutationFn: (e: T) => repo.save(e),
      onSuccess: () => {
        toast.success("ذخیره شد");
        invalidate();
      },
      onError: (e: Error) => toast.error(e.message),
    }),
    remove: useMutation({
      mutationFn: (id: string) => repo.remove(id),
      onSuccess: () => {
        toast.success("حذف شد");
        invalidate();
      },
      onError: (e: Error) => toast.error(e.message),
    }),
  };
}

export function useProfile() {
  const qc = useQueryClient();
  const profile = getBackend().profile;
  return {
    query: useQuery({ queryKey: ["profile"], queryFn: () => profile.get() }),
    save: useMutation({
      mutationFn: profile.save,
      onSuccess: () => {
        toast.success("ذخیره شد");
        qc.invalidateQueries({ queryKey: ["profile"] });
      },
      onError: (e: Error) => toast.error(e.message),
    }),
  };
}

export function useMessages() {
  const qc = useQueryClient();
  const repo = getBackend().messages;
  const invalidate = () => qc.invalidateQueries({ queryKey: ["messages"] });
  return {
    query: useQuery({ queryKey: ["messages"], queryFn: () => repo.list() }),
    markRead: useMutation({ mutationFn: (v: { id: string; read: boolean }) => repo.markRead(v.id, v.read), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: (id: string) => repo.remove(id), onSuccess: invalidate }),
  };
}
