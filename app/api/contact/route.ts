import { NextRequest, NextResponse } from 'next/server';
import { getResendClient } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, email, phone, details } = body;

    if (!name || !company || !email || !details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { client, fromEmail } = await getResendClient();

    const subject = `Website Lead – ${company}`;

    await client.emails.send({
      from: fromEmail,
      to: 'info@acesaerodynamics.com',
      replyTo: email,
      subject,
      html: `
        <h2>New Quote Request from Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <h3>Project Details:</h3>
        <p>${details.replace(/\n/g, '<br>')}</p>
      `,
      text: `
New Quote Request from Website

Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone || 'Not provided'}

Project Details:
${details}
      `.trim()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
