import { auth } from "@/auth";
import type { Session } from "next-auth";

export type AdminAuthResult =
  | { ok: true; session: Session }
  | { ok: false; status: 401 | 403 };

export async function requireAdminSession(): Promise<AdminAuthResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, status: 401 };
  }
  if (!session.user.isAdmin) {
    return { ok: false, status: 403 };
  }
  return { ok: true, session };
}
