/**
 * server/mail.ts — sends the Contact page's form submissions over SMTP so
 * leads actually reach someone instead of vanishing (the form used to just
 * fake a success toast with no backend at all).
 */
import nodemailer from "nodemailer";

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  sector?: string;
  projectType?: string;
  phone?: string;
  message: string;
}

export class MailError extends Error {
  constructor(
    message: string,
    public status: number,
    public userHint?: string,
  ) {
    super(message);
    this.name = "MailError";
  }
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new MailError(
      "SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing).",
      503,
      "L'envoi d'email n'est pas configuré sur le serveur.",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendContactSubmission(data: ContactSubmission): Promise<void> {
  if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
    throw new MailError("Missing required contact fields", 400);
  }

  const transporter = getTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const to = process.env.MAIL_TO || "contact@botler360.com";

  const rows: Array<[string, string | undefined]> = [
    ["Nom", data.name],
    ["Email", data.email],
    ["Société", data.company],
    ["Secteur", data.sector],
    ["Type de projet", data.projectType],
    ["Téléphone", data.phone],
  ];

  const textBody = [
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    data.message,
  ].join("\n");

  const htmlRows = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v!)}</td></tr>`)
    .join("");

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: data.email,
      subject: `Nouveau contact — ${data.name}`,
      text: textBody,
      html: `<table>${htmlRows}</table><p><strong>Message:</strong></p><p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new MailError(msg, 502, "Le serveur n'a pas pu envoyer l'email. Réessayez ou contactez-nous directement.");
  }
}
