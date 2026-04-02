"use client";

import { civicModalStore } from "@/lib/civic-modal-store";
import { cn } from "@/lib/cn";
import Link from "next/link";

const btn =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[5px] border-[1.5px] border-line-strong px-[22px] py-2.5 font-sans text-[13px] font-medium transition-all no-underline";
const btnPrimary =
  "border-ink bg-ink text-paper hover:opacity-85";
const btnGhost = "bg-transparent text-ink hover:border-ink";

export function AboutCtas() {
  return (
    <div className='flex flex-wrap gap-2.5'>
      <Link href='/pipeline' className={cn(btn, btnGhost)}>
        View pipeline →
      </Link>
      <Link href='/directory' className={cn(btn, btnGhost)}>
        Browse directory →
      </Link>
      <button
        type='button'
        className={cn(btn, btnPrimary)}
        onClick={() => civicModalStore.openChoose()}
      >
        + Suggest or submit
      </button>
    </div>
  );
}
