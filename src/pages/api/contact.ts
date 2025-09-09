import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";

export const prerender = false;

const BodySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
  _hp: z.string().optional(),
  _ts: z.string().optional(),
});

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const CONTACT_TO = import.meta.env.CONTACT_TO;
const CONTACT_FROM = import.meta.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const mask = (s: string) => s.replace(/(.).+(@.+)/, (_m, a, b) => `${a}***${b}`);

function htmlEmail({ name, email, message }: { name: string; email: string; message: string }) {
  return `
  <div style="font: 14px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Arial,sans-serif; padding:24px; color:#e7ebf0; background:#0c0f14">
    <h2 style="margin:0 0 8px">New portfolio contact</h2>
    <p style="margin:0 0 12px; opacity:.85">You received a new message from your website.</p>
    <table style="border-collapse:collapse">
      <tr><td style="opacity:.8;padding:6px 0;width:120px">Name</td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="opacity:.8;padding:6px 0">Email</td><td>${escapeHtml(email)}</td></tr>
    </table>
    <div style="margin-top:16px;padding:12px;border:1px solid #23303d;border-radius:12px;background:#0f141b">
      <pre style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</pre>
    </div>
  </div>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

async function parseBody(req: Request): Promise<Record<string, string>> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return (await req.json()) as any;
  }
  const fd = await req.formData();
  const o: Record<string, string> = {};
  fd.forEach((v, k) => (o[k] = String(v)));
  return o;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const t0 = Date.now();

  if (request.method !== "POST") {
    return json({ ok: false, code: "method_not_allowed", error: "Method not allowed" }, 405);
  }

  try {
    const raw = await parseBody(request);
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      const issues = parsed.error.flatten();
      return json({ ok: false, code: "invalid_input", error: "Invalid input", issues }, 400);
    }
    const { name, email, message, _hp, _ts } = parsed.data;

    if (_hp && _hp.trim() !== "") {
      return json({ ok: true, ignored: "honeypot" }, 200);
    }
    if (_ts) {
      const age = Date.now() - Number(_ts);
      if (!Number.isFinite(age) || age < 3000) {
        return json({ ok: true, ignored: "too_fast" }, 200);
      }
    }

    if (!resend || !CONTACT_TO) {
      console.log("[contact:dev] send skipped", {
        ip: clientAddress,
        name,
        email: mask(email),
        to: CONTACT_TO ? mask(CONTACT_TO) : "(unset)",
      });
      return json({ ok: true, dev: true }, 200);
    }

    const subject = `Portfolio message from ${name}`;
    
    const { data, error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      subject,
      replyTo: email,
      html: htmlEmail({ name, email, message }),
    });

    if (error) {
      return json({ ok: false, code: "send_failed", error: "Email send failed" }, 502);
    }

    return json({ ok: true, id: data?.id }, 200);
  } catch (err) {
    return json({ ok: false, code: "server_error", error: "Server error" }, 500);
  }
};
