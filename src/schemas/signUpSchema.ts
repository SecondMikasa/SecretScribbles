import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(2, "Username must be atmost 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

export const emailValidation = z
    .string()
    .email({ message: "Invalid email address" })
    
export const passwordValidation = z
    .string()
    .min(6, {message: "Password must be atleast 6 characters"})
    .max(16)

export const signUpSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation,
})