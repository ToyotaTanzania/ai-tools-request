import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'no-reply@karimjee.com',
    pass: process.env.SMTP_PASSWORD,
  },
  tls: { ciphers: 'SSLv3' },
})

const FROM = `"Karimjee AI Tool Vetting" <${process.env.SMTP_USER || 'no-reply@karimjee.com'}>`

function wrap(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;font-size:14px;color:#222;max-width:640px;margin:0 auto;padding:24px">
  <div style="border-bottom:3px solid #1d4ed8;padding-bottom:12px;margin-bottom:24px">
    <strong style="font-size:18px;color:#1d4ed8">Karimjee Group</strong>
    <span style="color:#666;margin-left:8px">AI Tool Vetting Portal</span>
  </div>
  ${body}
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999">
    This is an automated notification. Do not reply to this email.
  </div>
</body>
</html>`
}

export async function sendMail(to: string[], subject: string, html: string): Promise<void> {
  await transporter.sendMail({ from: FROM, to, subject, html: wrap(html) })
}
