import { z } from 'zod'

export const verifySchema = z.object({
    username: z.string().min(1, "Username is required"),
    code: z.string().length(6, 'Verification code must be of 6 digits')
})