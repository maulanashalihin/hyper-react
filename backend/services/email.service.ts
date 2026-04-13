import 'dotenv/config';
import { Resend } from 'resend';
import { bgBlue, black, blue, green, red } from 'colorette';

interface EmailTemplate {
  subject: string;
  template: string;
}

export class EmailService {
  private resend: Resend | null = null;
  private isSimulationMode: boolean;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (apiKey && apiKey !== 'your-api-key-here') {
      this.resend = new Resend(apiKey);
      this.isSimulationMode = false;
    } else {
      this.isSimulationMode = true;
    }
  }

  async sendVerification(email: string, token: string): Promise<void> {
    const template: EmailTemplate = {
      subject: 'Verify Your Email',
      template: 'verification',
    };

    await this.sendEmail(email, template, { token });
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const template: EmailTemplate = {
      subject: 'Reset Your Password',
      template: 'password-reset',
    };

    await this.sendEmail(email, template, { token });
  }

  async sendWelcome(email: string): Promise<void> {
    const template: EmailTemplate = {
      subject: 'Welcome to HyperReact!',
      template: 'welcome',
    };

    await this.sendEmail(email, template);
  }

  private async sendEmail(
    email: string,
    template: EmailTemplate,
    data?: { token?: string }
  ): Promise<void> {
    if (this.isSimulationMode) {
      this.printSimulationBox(email, template, data?.token);
      return;
    }

    if (!this.resend) {
      throw new Error('Resend client not initialized');
    }

    try {
      await this.resend.emails.send({
        from: 'HyperReact <onboarding@resend.dev>',
        to: email,
        subject: template.subject,
        html: this.renderTemplate(template.template, data),
      });

      console.log(`${green('✓')} Email sent to ${blue(email)}`);
    } catch (error) {
      console.error(`${red('✗')} Failed to send email:`, error);
      throw error;
    }
  }

  private printSimulationBox(
    email: string,
    template: EmailTemplate,
    token?: string
  ): void {
    const width = 50;
    const title = '📧 EMAIL SENT (Simulation Mode)';
    const lines = [
      `To: ${email}`,
      `Subject: ${template.subject}`,
      ...(token ? [`Token: ${token}`] : []),
      `Template: ${template.template}`,
    ];

    const horizontalLine = '─'.repeat(width);
    const topLine = '┌' + horizontalLine + '┐';
    const middleLine = '├' + horizontalLine + '┤';
    const bottomLine = '└' + horizontalLine + '┘';

    console.log('\n');
    console.log(black(bgBlue(` ${title.padEnd(width - 1)} `)));
    console.log(black(bgBlue(middleLine)));

    for (const line of lines) {
      const paddedLine = line.padEnd(width - 2);
      console.log(black(bgBlue(`│ ${paddedLine}│`)));
    }

    console.log(black(bgBlue(bottomLine)));
    console.log('\n');
  }

  private renderTemplate(templateName: string, data?: { token?: string }): string {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const templates: Record<string, string> = {
      verification: `
        <h1>Verify Your Email</h1>
        <p>Thank you for registering! Please verify your email by clicking the link below:</p>
        <p><a href="${baseUrl}/verify-email?token=${data?.token}">Verify Email</a></p>
        <p>Or copy this token: <code>${data?.token}</code></p>
      `,
      'password-reset': `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <p><a href="${baseUrl}/reset-password?token=${data?.token}">Reset Password</a></p>
        <p>Or copy this token: <code>${data?.token}</code></p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
      welcome: `
        <h1>Welcome to HyperReact!</h1>
        <p>Your account has been successfully created.</p>
        <p>Get started by exploring the dashboard.</p>
      `,
    };

    return templates[templateName] || '<p>Email template not found</p>';
  }
}

export const emailService = new EmailService();
