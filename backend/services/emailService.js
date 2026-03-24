import nodemailer from 'nodemailer';
import dns from 'node:dns/promises';
import net from 'node:net';

const NETWORK_RETRY_ERROR_CODES = new Set(['ETIMEDOUT', 'ESOCKET', 'ECONNECTION', 'ENETUNREACH', 'EHOSTUNREACH', 'ECONNRESET']);

const isRetriableNetworkError = (error) => {
    const code = error?.code;
    const message = String(error?.message || '').toLowerCase();

    if (code && NETWORK_RETRY_ERROR_CODES.has(code)) {
        return true;
    }

    return message.includes('timeout') || message.includes('unreach');
};

const createSmtpTransport = ({ hostOverride } = {}) => {
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpSecure = process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE === 'true'
        : smtpPort === 465;

    return nodemailer.createTransport({
        host: hostOverride || process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        // Hosted environments may fail on IPv6 routes; prefer IPv4 sockets.
        family: 4,
        // Keep SMTP calls from hanging indefinitely.
        connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 15000),
        greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 15000),
        socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 20000),
        // Preserve TLS SNI when retrying with an IP address.
        tls: hostOverride ? { servername: process.env.SMTP_HOST } : undefined,
    });
};

const sendWithOptionalIpv4Retry = async (mailOptions) => {
    let primaryError;

    try {
        const primaryTransporter = createSmtpTransport();
        return await primaryTransporter.sendMail(mailOptions);
    } catch (error) {
        primaryError = error;
    }

    if (!isRetriableNetworkError(primaryError)) {
        throw primaryError;
    }

    const host = process.env.SMTP_HOST;
    const isIpHost = net.isIP(host) !== 0;
    const fallbackHost = isIpHost ? host : (await dns.resolve4(host))[0];
    if (!fallbackHost) {
        throw primaryError;
    }

    const fallbackTransporter = createSmtpTransport({ hostOverride: fallbackHost });
    return fallbackTransporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (to, resetUrl) => {
    // Determine if using real SMTP or Ethereal for testing
    let transporter;
    const hasSmtpConfig = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (hasSmtpConfig) {
        // Real SMTP configuration (e.g., Gmail, SendGrid, etc.)
        transporter = createSmtpTransport();
    } else if (isProduction) {
        // In deployed environments, don't silently fall back to test SMTP.
        throw new Error('SMTP is not configured in production. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.');
    } else {
        // Fallback to Ethereal Email (fake SMTP service) for local testing
        console.log("No SMTP settings found in .env. Falling back to Ethereal Email.");
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    const mailOptions = {
        from: `"Co-Notes Support" <${process.env.SMTP_FROM || 'noreply@conotes.app'}>`,
        to: to,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0;">Co-Notes</h1>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <h2 style="color: #333333; margin-top: 0;">Reset Your Password</h2>
                    <p style="color: #555555; line-height: 1.6;">You requested a password reset. Please click the button below to set a new password. This link will expire in 1 hour.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #ec4899; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="color: #555555; line-height: 1.6; margin-bottom: 0;">If you didn't request this, you can safely ignore this email.</p>
                </div>
                <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Co-Notes. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    let info;
    try {
        // `sendMail` already establishes the SMTP connection. Running `verify`
        // on every forgot-password request can fail in some hosted environments
        // even when the message itself can be sent successfully.
        info = hasSmtpConfig
            ? await sendWithOptionalIpv4Retry(mailOptions)
            : await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Failed to send password reset email: ${error.message}`);
    }
    
    // If using Ethereal, log the preview URL
    if (info.messageId && !hasSmtpConfig) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
};
