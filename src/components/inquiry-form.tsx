"use client";

import { useEffect, useState } from "react";

const COOLDOWN_MS = 5 * 60 * 1000;
const COOLDOWN_KEY = "sinag:last-inquiry";

const fields = [
  { name: "name", label: "Name", type: "text", required: true, autoComplete: "name" },
  { name: "company", label: "Company", type: "text", required: false, autoComplete: "organization" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "contact", label: "Contact number", type: "tel", required: false, autoComplete: "tel" },
] as const;

const inputClass =
  "type-body-sm mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-[var(--brand-dark)] transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25";

function formatRemaining(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [remaining, setRemaining] = useState(0);

  // The server enforces the cooldown; this mirrors it so the wait is visible
  // instead of arriving as a rejection. localStorage keeps it across reloads.
  useEffect(() => {
    const tick = () => {
      let last = 0;
      try {
        last = Number(window.localStorage.getItem(COOLDOWN_KEY) ?? 0);
      } catch {
        last = 0;
      }
      const left = last ? last + COOLDOWN_MS - Date.now() : 0;
      setRemaining(left > 0 ? left : 0);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (remaining > 0 || status === "sending") return;

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setErrors({});
    setFormError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 422) {
        const payload = await response.json();
        setErrors(payload.errors ?? {});
        setStatus("idle");
        return;
      }

      if (response.status === 429) {
        const payload = await response.json();
        const wait = Number(payload.retryAfter ?? 300) * 1000;
        try {
          window.localStorage.setItem(COOLDOWN_KEY, String(Date.now() - (COOLDOWN_MS - wait)));
        } catch {}
        setFormError("You have already sent an inquiry. Please wait before sending another.");
        setStatus("idle");
        return;
      }

      if (!response.ok) throw new Error(String(response.status));

      try {
        window.localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      } catch {}
      form.reset();
      setStatus("sent");
    } catch {
      setFormError("Something went wrong sending that. Please try again, or email us directly.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-[#0a745f]/30 bg-white px-8 py-10 text-center shadow-[0_14px_28px_rgba(12,47,87,0.06)]">
        <p className="type-emphasis font-semibold text-[#0a745f]">Thank you — your inquiry is in.</p>
        <p className="type-body mt-3 text-slate-700">
          We will come back to you at the email address you gave us.
        </p>
        {remaining > 0 && (
          <p className="type-body-sm mt-6 text-slate-500">
            You can send another in {formatRemaining(remaining)}.
          </p>
        )}
      </div>
    );
  }

  const blocked = remaining > 0;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-[var(--line)] bg-white px-8 py-8 shadow-[0_14px_28px_rgba(12,47,87,0.06)]"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className="block">
            <span className="type-body-sm font-semibold text-[var(--brand-dark)]">
              {field.label}
              {field.required && <span className="text-[#0a745f]"> *</span>}
            </span>
            <input
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              aria-invalid={Boolean(errors[field.name])}
              className={inputClass}
            />
            {errors[field.name] && (
              <span className="type-kicker mt-1 block text-red-600">{errors[field.name]}</span>
            )}
          </label>
        ))}
      </div>

      <label className="mt-5 block">
        <span className="type-body-sm font-semibold text-[var(--brand-dark)]">
          Message<span className="text-[#0a745f]"> *</span>
        </span>
        <textarea
          name="message"
          rows={6}
          aria-invalid={Boolean(errors.message)}
          className={`${inputClass} resize-y`}
        />
        {errors.message && (
          <span className="type-kicker mt-1 block text-red-600">{errors.message}</span>
        )}
      </label>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {formError && <p className="type-body-sm mt-5 text-red-600">{formError}</p>}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={blocked || status === "sending"}
          className="type-body inline-flex items-center rounded-full bg-[var(--brand)] px-8 py-3 font-semibold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === "sending" ? "Sending…" : "Send inquiry"}
        </button>
        {blocked && (
          <span className="type-body-sm text-slate-500">
            You can send another in {formatRemaining(remaining)}.
          </span>
        )}
      </div>
    </form>
  );
}
