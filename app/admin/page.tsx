import { auth } from "@/auth";
import { SiteFooter } from "@/components/civic/SiteFooter";
import { redirect } from "next/navigation";
import { AdminListingsBoard } from "./AdminListingsBoard";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }
  if (!session.user.isAdmin) {
    redirect("/");
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <section className='mx-auto w-full max-w-[900px] flex-1 px-10 py-12 max-md:px-5'>
        <h1 className='mb-1 font-display text-[26px] font-extrabold tracking-tight'>
          Admin
        </h1>
        <p className='mb-8 text-sm text-muted'>
          Moderate directory listings (approve to publish) and review pipeline
          suggestions (ideas in the Suggested column).
        </p>
        <AdminListingsBoard />
      </section>
      <SiteFooter short />
    </div>
  );
}
