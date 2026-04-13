import { describe, it, expect } from 'vitest';
import { EmailService } from '../services/email.service';

describe('Email Service (Simulation Mode)', () => {
  const emailService = new EmailService();

  it('should send verification email in simulation mode', async () => {
    const testEmail = 'test@example.com';
    const testToken = 'verification-token-123';

    await expect(
      emailService.sendVerification(testEmail, testToken)
    ).resolves.not.toThrow();
  });

  it('should send password reset email in simulation mode', async () => {
    const testEmail = 'test@example.com';
    const testToken = 'reset-token-456';

    await expect(
      emailService.sendPasswordReset(testEmail, testToken)
    ).resolves.not.toThrow();
  });
});
