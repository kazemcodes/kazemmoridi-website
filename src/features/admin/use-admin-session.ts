import { useCallback, useEffect, useState } from "react";
import { getBackend } from "@/infrastructure";
import type { AdminUser } from "@/domain/types";

type State =
  | { status: "loading" }
  | { status: "unconfigured" }
  | { status: "signed-out" }
  | { status: "forbidden"; user: AdminUser }
  | { status: "ready"; user: AdminUser };

/** Resolves the admin session through the AuthService port. */
export function useAdminSession() {
  const [state, setState] = useState<State>({ status: "loading" });

  const resolve = useCallback(async () => {
    const backend = getBackend();
    if (!backend.configured) return setState({ status: "unconfigured" });
    const user = await backend.auth.current();
    if (!user) return setState({ status: "signed-out" });
    setState((await backend.auth.isAdmin()) ? { status: "ready", user } : { status: "forbidden", user });
  }, []);

  useEffect(() => {
    resolve();
    return getBackend().auth.onChange(() => resolve());
  }, [resolve]);

  return state;
}
