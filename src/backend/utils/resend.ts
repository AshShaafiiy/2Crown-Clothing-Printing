import { Resend } from 'resend';

// DEFERRED: Resend email integration is deferred until automated transactional emails are required
export const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');
