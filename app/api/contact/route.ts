import { NextRequest, NextResponse } from 'next/server';
import { getResendClient } from '@/lib/resend';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, email, phone, details } = body;

    if (!name || !company || !email || !details) {
      return NextResponse.json(
        { error: 'Missing required fields: name, company, email, and details are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const { client, fromEmail, toEmail } = getResendClient();

    const subject = `Website Lead – ${escapeHtml(company)}`;
    const safeName = escapeHtml(name);
    const safeCompany = escapeHtml(company);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || 'Not provided');
    const safeDetails = escapeHtml(details).replace(/\n/g, '<br>');

    const htmlEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 600; color: #1a1a1a;">New Quote Request</h1>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">From the website contact form</p>
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
              
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Name</span>
                    <p style="margin: 4px 0 0 0; font-size: 16px; color: #1a1a1a;">${safeName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Company</span>
                    <p style="margin: 4px 0 0 0; font-size: 16px; color: #1a1a1a;">${safeCompany}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                    <p style="margin: 4px 0 0 0; font-size: 16px; color: #1a1a1a;"><a href="mailto:${safeEmail}" style="color: #0066cc; text-decoration: none;">${safeEmail}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Phone</span>
                    <p style="margin: 4px 0 0 0; font-size: 16px; color: #1a1a1a;">${safePhone}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Project Details</span>
                    <p style="margin: 8px 0 0 0; font-size: 15px; color: #333; line-height: 1.6;">${safeDetails}</p>
                  </td>
                </tr>
              </table>
              
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
              <p style="margin: 0; font-size: 12px; color: #999;">Reply directly to this email to respond to ${safeName}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const textEmail = `
New Quote Request from Website
==============================

Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone || 'Not provided'}

Project Details:
${details}

---
Reply directly to this email to respond to ${name}.
    `.trim();

    const result = await client.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject,
      html: htmlEmail,
      text: textEmail
    });

    console.log('Resend result:', JSON.stringify(result));

    if (result.error) {
      console.error('Resend error:', result.error);
      return NextResponse.json(
        { error: result.error.message || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
