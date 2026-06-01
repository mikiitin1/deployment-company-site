// Vercel serverless function — receives contact form submissions and stores
// them in Supabase. The table has an insert-only RLS policy for the anon role,
// so this key can only INSERT (never read) rows. Runs server-side so we can
// validate input before writing. Dependency-free: talks to Supabase's REST API.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const name = (body.name || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const company = (body.company || "").toString().trim();
    const message = (body.message || "").toString().trim();
    const locale = (body.locale || "en").toString().trim().slice(0, 5);

    // Basic validation — mirror the front-end's required fields.
    if (!name || !email || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }
    if (name.length > 200 || email.length > 320 || company.length > 200 || message.length > 5000) {
      res.status(400).json({ error: "Field too long" });
      return;
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars");
      res.status(500).json({ error: "Server not configured" });
      return;
    }

    const r = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        name,
        email,
        company: company || null,
        message,
        locale
      })
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("Supabase insert failed", r.status, detail);
      res.status(502).json({ error: "Could not save submission" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Unexpected error in /api/contact", err);
    res.status(500).json({ error: "Unexpected error" });
  }
}
