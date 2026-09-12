"use client";

import { useActionState } from "react";

import { submitContact, type ContactState } from "@/app/contact/actions";

const initial: ContactState = { ok: false, message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  return (
    <form action={action} className="mt-8 max-w-lg space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm">
          নাম
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-md border border-rule bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm">
          ইমেইল
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-rule bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm">
          বার্তা
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-rule bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-5 py-2 text-sm text-paper disabled:opacity-60"
      >
        {pending ? "পাঠানো হচ্ছে..." : "পাঠান"}
      </button>
      {state.message ? (
        <p className="text-sm text-muted" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
