import { z } from 'zod';

export const forgotPasswordSchema = z.object({
    identifier: z.string().min(1, "Username or email is required"),
});

export const resetPasswordSchema = z.object({
    identifier: z.string().min(1, "Username or email is required"),
    code: z.string().length(6, "Verification code must be 6 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});