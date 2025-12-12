import { Resend } from 'resend';

const FROM_EMAIL = 'Contact Form <onboarding@resend.dev>';
const TO_EMAIL = 'lukas@reuxnergy.co.za';

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  
  return {
    client: new Resend(apiKey),
    fromEmail: FROM_EMAIL,
    toEmail: TO_EMAIL
  };
}
