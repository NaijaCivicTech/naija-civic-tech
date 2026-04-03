import { SiteFooter } from "@/components/civic/SiteFooter";
import { AboutCtas } from "./AboutCtas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | NaijaCivicTech",
  description:
    "Why NaijaCivicTech exists: open civic tools, a shared data layer, and a platform for coordination—not a manifesto.",
};

const h2 =
  "mb-3 font-display text-lg font-extrabold tracking-tight text-ink";
const p = "mb-4 text-[15px] font-light leading-[1.7] text-muted last:mb-0";
const ul =
  "mb-4 list-disc space-y-2 pl-5 text-[15px] font-light leading-[1.65] text-muted";

export default function AboutPage() {
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <article className='mx-auto w-full max-w-[720px] flex-1 px-10 pb-16 pt-12 max-md:px-5'>
        <p className='mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand'>
          About
        </p>
        <h1 className='mb-4 font-display text-[clamp(26px,4vw,34px)] font-extrabold leading-tight tracking-tight'>
          Why NaijaCivicTech exists
        </h1>
        <p className={`${p} text-base`}>
          Nigeria&apos;s problems are deep and many. So are the Nigerians
          capable of solving them. But civic tools built in isolation die in
          isolation. Closed source, underfunded, and unknown, they solve
          problems quietly and disappear without leaving anything behind.
        </p>
        <p className={p}>
          NaijaCivicTech exists to change that. One open source tool at a time,
          on one platform, with one shared data layer that grows every time a
          Nigerian reports an outage, rates a politician, flags a security
          incident, or stress-tests a voting prototype.
        </p>
        <p className={p}>
          This is not a manifesto. It is a working platform.
        </p>

        <h2 className={`${h2} mt-10`}>What we believe</h2>
        <ul className={ul}>
          <li>
            <strong className='font-medium text-ink'>Public by default.</strong>{" "}
            Civic information belongs to everyone. Politician records, outage
            maps, security data, and pipeline stages are visible without a login.
            No paywalls on public data.
          </li>
          <li>
            <strong className='font-medium text-ink'>One slice at a time.</strong>{" "}
            There are countless problems worth solving. We focus on tractable
            civic challenges with clear acceptance criteria so builders are not
            pretending one app fixes the whole country.
          </li>
          <li>
            <strong className='font-medium text-ink'>
              Open source as infrastructure.
            </strong>{" "}
            Every tool on this platform is open source. The data is auditable,
            the methodology is transparent, and the platform survives beyond any
            single contributor or funding cycle.
          </li>
          <li>
            <strong className='font-medium text-ink'>Community over hype.</strong>{" "}
            This platform is for coordination, contribution, and discovery, not
            for claiming ownership of every roadmap or waiting for institutional
            permission to build.
          </li>
          <li>
            <strong className='font-medium text-ink'>Honesty about limits.</strong>{" "}
            Not every Nigerian problem is a software problem. We care about the
            ones where data, transparency, or citizen-facing tools can move the
            needle even when institutions move slowly.
          </li>
          <li>
            <strong className='font-medium text-ink'>
              The fight is with the problem, not the institution.
            </strong>{" "}
            We build with deep understanding of the barriers. When the window
            for change opens, we will not be starting from zero.
          </li>
        </ul>

        <h2 className={`${h2} mt-10`}>What you will find here</h2>
        <ul className={ul}>
          <li>
            <strong className='font-medium text-ink'>Native tools:</strong>{" "}
            LightUp NG for power outage tracking, PolitiLog NG (the political
            ledger), eVote NG (the voting prototype), and more as the community
            builds them. All accessible from one dashboard after a single login.
          </li>
          <li>
            <strong className='font-medium text-ink'>Tool directory:</strong>{" "}
            existing civic tools built by others, listed and credited. The
            community checks here before building to avoid duplicating what
            already exists.
          </li>
          <li>
            <strong className='font-medium text-ink'>Pipeline:</strong> ideas
            and stages from community suggestion through to live, with upvotes,
            acceptance criteria, and team formation.
          </li>
          <li>
            <strong className='font-medium text-ink'>Public data:</strong>{" "}
            everything the platform collects is open, exportable, and available
            via API for researchers, journalists, and other builders.
          </li>
        </ul>

        <h2 className={`${h2} mt-10`}>Get involved</h2>
        <p className={p}>
          If you are a developer, designer, domain expert, researcher, or just
          someone with a sharp problem statement, you belong here. Browse the
          pipeline, explore the directory, or open the submit flow from the
          header. No group chat required. The work is in the open.
        </p>
        <AboutCtas />
      </article>
      <SiteFooter short />
    </div>
  );
}
