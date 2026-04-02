import { SiteFooter } from "@/components/civic/SiteFooter";
import { AboutCtas } from "./AboutCtas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | NaijaCivicTech",
  description:
    "Why we’re building a public directory and pipeline of civic tech for Nigeria: community, openness, and focused problems.",
};

const h2 =
  "mb-3 font-display text-lg font-extrabold tracking-tight text-ink";
const p = "mb-4 text-[15px] font-light leading-[1.7] text-muted last:mb-0";
const ul = "mb-4 list-disc space-y-2 pl-5 text-[15px] font-light leading-[1.65] text-muted";

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
          Nigeria’s problems are deep and many. So are the Nigerians building
          small tools (verification, transparency, health, infrastructure,
          democracy), often in the open, often without a single place to find
          each other or to turn an idea into a shared sprint.
        </p>
        <p className={p}>
          This project is not a manifesto. It is a{" "}
          <strong className='font-medium text-ink'>working cluster</strong>: a
          directory of what exists, a pipeline for what could be built next, and
          room for the community to suggest, upvote, and form teams. We learn in
          public and try to ship where technology can actually help, not
          everywhere, but where the impact is obvious.
        </p>

        <h2 className={`${h2} mt-10`}>What we believe</h2>
        <ul className={ul}>
          <li>
            <strong className='font-medium text-ink'>Public by default.</strong>{" "}
            Listings, pipeline stages, and contributions should be visible so
            others can discover, fork, improve, or join, without everything
            living in siloed group chats alone.
          </li>
          <li>
            <strong className='font-medium text-ink'>One slice at a time.</strong>{" "}
            There are countless paths; we focus on tractable civic problems and
            clear “done” criteria so builders are not pretending one app fixes
            the whole country.
          </li>
          <li>
            <strong className='font-medium text-ink'>Community over hype.</strong>{" "}
            Teams change; people pivot. This site is for coordination and
            discovery, not claiming ownership of every roadmap.
          </li>
          <li>
            <strong className='font-medium text-ink'>Honesty about limits.</strong>{" "}
            Not every national issue is a software issue. We care about the ones
            where data, transparency, or citizen-facing tools can move the needle
            even when institutions move slowly.
          </li>
        </ul>

        <h2 className={`${h2} mt-10`}>What you’ll find here</h2>
        <ul className={ul}>
          <li>
            <strong className='font-medium text-ink'>Tool directory:</strong>{" "}
            projects that are listed for the community after review where
            applicable.
          </li>
          <li>
            <strong className='font-medium text-ink'>Pipeline:</strong> ideas
            and stages from suggestion through to live, with votes and (where
            relevant) acceptance criteria and teams.
          </li>
          <li>
            <strong className='font-medium text-ink'>Ways to contribute:</strong>{" "}
            submit something you’ve built, suggest a problem worth solving, or
            explore what others are shipping.
          </li>
        </ul>

        <h2 className={`${h2} mt-10`}>Get involved</h2>
        <p className={p}>
          If you’re a passionate builder, a domain expert, or someone with a
          sharp problem statement, you belong in the loop. Start from the
          pipeline or directory, or open the submit flow from the header.
        </p>
        <AboutCtas />
      </article>
      <SiteFooter short />
    </div>
  );
}
