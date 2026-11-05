"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function CorrectionForm() {
  const page = useSearchParams().get("page") ?? "/";
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  if (state === "sent")
    return (
      <div className="card mt-8 flex items-start gap-3 p-5" role="status">
        <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" strokeWidth={1.5} aria-hidden />
        <div>
          <p className="font-medium text-ink">Thank you — the correction has been recorded.</p>
          <p className="mt-1 text-sm text-body">An editor will check it against the source before the record changes.</p>
        </div>
      </div>
    );

  const field = "mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent/60";
  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setState("sending");
        const res = await fetch("/api/corrections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: fd.get("page"), message: fd.get("message"), source: fd.get("source") || undefined, email: fd.get("email") || "" }),
        }).catch(() => null);
        if (res?.ok) setState("sent");
        else {
          setError((await res?.json().catch(() => null))?.error ?? "Couldn't send the correction. Please try again.");
          setState("error");
        }
      }}
    >
      <label className="block text-sm font-medium text-ink">
        Page
        <input name="page" defaultValue={page} readOnly className={`${field} text-muted-strong`} />
      </label>
      <label className="block text-sm font-medium text-ink">
        What&apos;s wrong, and what should it say?
        <textarea name="message" required minLength={10} rows={5} className={field} />
      </label>
      <label className="block text-sm font-medium text-ink">
        Source <span className="font-normal text-muted-strong">(link or citation)</span>
        <input name="source" className={field} />
      </label>
      <label className="block text-sm font-medium text-ink">
        Email <span className="font-normal text-muted-strong">(optional, if you&apos;d like a reply)</span>
        <input name="email" type="email" className={field} />
      </label>
      {state === "error" && (
        <p role="alert" className="text-sm text-[var(--hyper-ink)]">
          {error}
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className="btn-grad rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-50">
        {state === "sending" ? "Sending…" : "Send correction"}
      </button>
    </form>
  );
}
