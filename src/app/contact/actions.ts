"use server";

import { apiUrl } from "@/lib/site";

export type ContactState = {
  ok: boolean;
  message: string;
};

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, message: "সব ঘর পূরণ করুন।" };
  }

  if (website) {
    return { ok: true, message: "ধন্যবাদ। আপনার বার্তা পেয়েছি।" };
  }

  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message, website }),
        signal: AbortSignal.timeout(8_000),
      });

      if (!response.ok) {
        return { ok: false, message: "এখন পাঠানো যায়নি। একটু পরে চেষ্টা করুন।" };
      }
    } catch {
      return { ok: false, message: "সার্ভারের সঙ্গে যোগাযোগ হয়নি।" };
    }
  }

  return { ok: true, message: "ধন্যবাদ। আপনার বার্তা পেয়েছি।" };
}
