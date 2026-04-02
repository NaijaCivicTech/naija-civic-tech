import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-0 flex-1 flex-col">
          <section className="mx-auto flex max-w-[420px] flex-col px-10 py-16 max-md:px-5">
            <p className="text-[13px] text-muted">Loading…</p>
          </section>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
