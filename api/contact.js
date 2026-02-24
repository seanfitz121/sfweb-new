// api/contact.js
// Vercel Serverless Function — handles contact form submissions via Resend
//
// Required environment variables (set in Vercel dashboard → Settings → Environment Variables):
//   RESEND_API_KEY     — your Resend API key
//   RESEND_FROM_EMAIL  — verified sender email (e.g. noreply@sfweb.ie)
//
// Install dependency:  npm install resend

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "123456789");
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@sfweb.ie";
const TO_EMAIL = "sean@sfweb.ie";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, business, email, phone, type, budget, message } = req.body;

  // Basic validation
  if (!name || !business || !email || !type || !message) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }

  try {
    // Send notification email to you
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Project Enquiry — ${business}`,
      replyTo: email,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #0d9488); padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 22px;">New Project Enquiry</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Submitted via sfweb.ie contact form</p>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; width: 140px; vertical-align: top; color: #64748b; font-size: 14px;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; width: 140px; vertical-align: top; color: #64748b; font-size: 14px;">Business</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px;">${escapeHtml(business)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; width: 140px; vertical-align: top; color: #64748b; font-size: 14px;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px;"><a href="mailto:${escapeHtml(email)}" style="color: #0ea5e9;">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; width: 140px; vertical-align: top; color: #64748b; font-size: 14px;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px;">${phone ? escapeHtml(phone) : "<em style='color:#94a3b8;'>Not provided</em>"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; width: 140px; vertical-align: top; color: #64748b; font-size: 14px;">Project Type</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px;"><span style="background: rgba(14,165,233,0.1); color: #0284c7; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;">${escapeHtml(type)}</span></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; width: 140px; vertical-align: top; color: #64748b; font-size: 14px;">Budget</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px;">${budget ? escapeHtml(budget) : "<em style='color:#94a3b8;'>Not specified</em>"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: 600; width: 140px; vertical-align: top; color: #64748b; font-size: 14px;">Message</td>
                <td style="padding: 12px 0; font-size: 14px; line-height: 1.7;">${escapeHtml(message).replace(/\n/g, "<br>")}</td>
              </tr>
            </table>
            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
              <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #0d9488); color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${escapeHtml(name)}</a>
            </div>
          </div>
        </div>
      `,
    });

    // Send confirmation email to the enquirer
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Thanks for your enquiry — SFWeb",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #0d9488); padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 22px;">Thanks for reaching out!</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 15px; line-height: 1.7; margin: 0 0 16px;">Hi ${escapeHtml(name)},</p>
            <p style="font-size: 15px; line-height: 1.7; margin: 0 0 16px;">Thanks for getting in touch about your project for <strong>${escapeHtml(business)}</strong>. I've received your enquiry and will get back to you within 24 hours.</p>
            <p style="font-size: 15px; line-height: 1.7; margin: 0 0 24px;">In the meantime, feel free to reply to this email if you have any additional details to share.</p>
            <p style="font-size: 15px; line-height: 1.7; margin: 0;">Cheers,<br><strong>Sean — SFWeb</strong></p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({ error: "Failed to send email. Please try again." });
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
