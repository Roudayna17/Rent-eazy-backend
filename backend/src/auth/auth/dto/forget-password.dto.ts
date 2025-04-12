// src/auth/dto/forget-password.dto.ts
export class ForgetPasswordDto {
    email: string;
    role: string; // Expected values: 'user', 'client', or 'lessor'
  }
  