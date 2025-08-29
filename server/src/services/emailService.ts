import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Highway Delite" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html
      });

      console.log(`Email sent successfully to ${to}: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendOTP(email: string, otp: string): Promise<boolean> {
    const subject = 'Your Highway Delite Verification Code';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            padding: 40px 20px; 
            text-align: center; 
          }
          .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 28px; 
            font-weight: 600; 
          }
          .content { 
            padding: 40px 20px; 
            text-align: center; 
          }
          .otp-box { 
            background: #f1f5f9; 
            border: 2px dashed #cbd5e1; 
            padding: 30px; 
            margin: 30px 0; 
            border-radius: 12px; 
          }
          .otp-code { 
            font-size: 36px; 
            font-weight: bold; 
            letter-spacing: 8px; 
            color: #1e293b; 
            margin: 10px 0; 
            font-family: 'Courier New', monospace;
          }
          .footer { 
            background: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            color: #64748b; 
            font-size: 14px; 
          }
          .warning {
            background: #fef3cd;
            border: 1px solid #fecaca;
            color: #92400e;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Highway Delite</h1>
          </div>
          <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Enter the following 6-digit verification code to complete your signup:
            </p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                This code expires in ${process.env.OTP_EXPIRES_IN || '10'} minutes
              </p>
            </div>
            <div class="warning">
              <strong>Security Notice:</strong> Never share this code with anyone. Highway Delite will never ask for your verification code via phone or email.
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Highway Delite. All rights reserved.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(email, subject, html);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const subject = 'Welcome to Highway Delite!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Highway Delite</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            padding: 40px 20px; 
            text-align: center; 
          }
          .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 28px; 
            font-weight: 600; 
          }
          .content { 
            padding: 40px 20px; 
            text-align: center; 
          }
          .welcome-box { 
            background: #f0f9ff; 
            border: 2px solid #0ea5e9; 
            padding: 30px; 
            margin: 30px 0; 
            border-radius: 12px; 
          }
          .footer { 
            background: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            color: #64748b; 
            font-size: 14px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Highway Delite</h1>
          </div>
          <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Welcome, ${name}!</h2>
            <div class="welcome-box">
              <p style="color: #0c4a6e; font-size: 16px; line-height: 1.6; margin: 0;">
                Your email has been verified successfully! You're all set to start taking amazing notes with Highway Delite.
              </p>
            </div>
            <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
              Start organizing your thoughts, ideas, and important information with our powerful note-taking features.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Highway Delite. All rights reserved.</p>
            <p>Happy note-taking!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(email, subject, html);
  }

  // Test email connection
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

const emailService = new EmailService();

export const sendOTPEmail = (email: string, otp: string) => emailService.sendOTP(email, otp);
export const sendWelcomeEmail = (email: string, name: string) => emailService.sendWelcomeEmail(email, name);
export const testEmailConnection = () => emailService.testConnection();

export default emailService;
