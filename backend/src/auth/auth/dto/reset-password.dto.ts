// src/auth/dto/reset-password.dto.ts
export class ResetPasswordDto {
    email: string;
    role: string; // Expected values: 'user', 'client', or 'lessor'
    code: string;
    newPassword: string;
  }
  