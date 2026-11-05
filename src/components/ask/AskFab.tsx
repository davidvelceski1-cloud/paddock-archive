"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { askStore, useAsk } from "@/lib/ask-store";

/** Floating "Ask" button, bottom-right on every page except the full-page assistant. */
export function AskFab() {
  const { open } = useAsk();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  if (open || pathname === "/ask") return null;
  return (
    <motion.button
      type="button"
      onClick={() => askStore.open()}
      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="btn-grad fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium shadow-lift transition-opacity hover:opacity-95"
      aria-label="Ask the Archive"
    >
      <Sparkles className="size-4" strokeWidth={1.5} aria-hidden />
      <span className="hidden sm:inline">Ask the Archive</span>
    </motion.button>
  );
}
