import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";

export const prerender = false;

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  _hp: z.string().optional(),             // honeypot (must be empty)
  _ts: z.string().optional(),             // timestamp
});

const resendKey = import.meta.env.RESEND_API_KEY;
const CONTACT_TO = import.meta.env.CONTACT_TO;       // your inbox
const CONTACT_FROM =
  import.meta.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";

const resend = resendKey ? new Resend(resendKey) : null;

function html({ name, email, message }: { name: string; email: string; message: string }) {
  return `
    <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;padding:24px;background:#0c0f14;color:#e7ebf0">
      <h2 style="margin:0 0 8px">New portfolio contact</h2>
      <p style="opacity:.9;margin:0 0 16px">Someone sent you a message from your site.</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="opacity:.8;padding:6px 0;width:120px">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="opacity:.8;padding:6px 0">Email</td><td>${escapeHtml(email)}</td></tr>
      </table>
      <div style="margin-top:16px;padding:12px;border:1px solid #23303d;border-radius:12px;background:#0f141b">
        <pre style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</pre>
      </div>
    </div>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]
  );
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Accept form-encoded or JSON
    const contentType = request.headers.get("content-type") || "";
    let data: any = {};
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const fd = await request.formData();
      fd.forEach((v, k) => (data[k] = String(v)));
    }

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid input" }), { status: 400 });
    }

    const { name, email, message, _hp, _ts } = parsed.data;

    // Simple anti-spam: honeypot empty, and time on page >= 3s
    if (_hp && _hp.trim() !== "") {
      return new Response(JSON.stringify({ ok: true }), { status: 200 }); // quietly ignore
    }
    if (_ts) {
      const age = Date.now() - Number(_ts);
      if (!Number.isFinite(age) || age < 3000) {
        return new Response(JSON.stringify({ ok: true }), { status: 200 }); // too fast → likely bot
      }
    }

    // Local/dev fallback
    if (!resend || !CONTACT_TO) {
      console.log("[contact:dev]", { clientAddress, name, email, message });
      return new Response(JSON.stringify({ ok: true, dev: true }), { status: 200 });
    }

    const subject = `Portfolio message from ${name}`;
    await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      subject,
      reply_to: email,
      html: html({ name, email, message }),
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("[contact:error]", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500 });
  }
};
