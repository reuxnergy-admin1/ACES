import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, message } = body;

    // Validate required fields
    if (!name || !email || !company || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email via Resend
    const result = await resend.emails.send({
      from: "contact@contactform.acesaerodynamics.co.za",
      to: "info@acesaerodynamics.com",
      replyTo: email,
      subject: `Website Lead – ${company}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #111827 !important; }
      .email-container { background-color: #1f2937 !important; }
      .header { background-color: #1f2937 !important; }
      .header-text { color: #ffffff !important; }
      .content-text { color: #e5e7eb !important; }
      .label-text { color: #9ca3af !important; }
      .value-text { color: #f3f4f6 !important; }
      .client-highlight { background-color: #374151 !important; }
      .client-name { color: #ffffff !important; }
      .message-box { background-color: #374151 !important; border-color: #4b5563 !important; }
      .footer { background-color: #111827 !important; border-color: #374151 !important; }
      .footer-text { color: #9ca3af !important; }
      .border-line { border-color: #374151 !important; }
      .button { background-color: #374151 !important; color: #ffffff !important; }
    }
  </style>
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
    <tr>
      <td align="center">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; max-width: 600px;">
          
          <!-- Header -->
          <tr>
            <td class="header" style="background-color: #f9fafb; padding: 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              <h1 class="header-text" style="color: #111827; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: bold;">ACES Aerodynamics</h1>
              <p class="header-text" style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">New Quote Request</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 class="content-text" style="color: #111827; margin: 0 0 20px 0; font-size: 20px;">New Contact Form Submission</h2>
              
              <div class="client-highlight" style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p class="client-name" style="margin: 0; font-size: 18px; font-weight: bold; color: #111827;">${escapeHtml(name)}</p>
              </div>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td class="border-line" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                    <p class="label-text" style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Email</p>
                    <p class="value-text" style="margin: 0; font-size: 16px; color: #111827;">${escapeHtml(email)}</p>
                  </td>
                </tr>
                <tr>
                  <td class="border-line" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                    <p class="label-text" style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Company</p>
                    <p class="value-text" style="margin: 0; font-size: 16px; color: #111827;">${escapeHtml(company)}</p>
                  </td>
                </tr>
                <tr>
                  <td class="border-line" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                    <p class="label-text" style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Phone</p>
                    <p class="value-text" style="margin: 0; font-size: 16px; color: #111827;">${escapeHtml(phone || "Not provided")}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <p class="label-text" style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Message</p>
                    <div class="message-box" style="margin: 10px 0 0 0; padding: 15px; background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
                      <p class="value-text" style="margin: 0; font-size: 16px; color: #111827; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message).replace(/\n/g, "<br>")}</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Reply Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(email)}?subject=Re: Your Quote Request - ACES Aerodynamics&body=Hi ${escapeHtml(name)},%0D%0A%0D%0AThank you for your quote request to ACES Aerodynamics.%0D%0A%0D%0A" 
                       class="button"
                       style="display: inline-block; padding: 14px 32px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Respond to Client
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer" style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p class="footer-text" style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280;">ACES Aerodynamics</p>
              <p class="footer-text" style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280;">Aerospace & Motorsport Specialist Engineering Components</p>
              <p class="footer-text" style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280;">5 Industria Street, Potchindustria, Potchefstroom, 2520</p>
              <p class="footer-text" style="margin: 0; font-size: 12px; color: #6b7280;">info@acesaerodynamics.com | +27 82 893 5583</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { message: "Failed to send email", error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully", id: result.data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request", error: String(error) },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
