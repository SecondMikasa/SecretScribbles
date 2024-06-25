import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resend";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code | Secret Scribbles',
            react: VerificationEmail({username, otp: verifyCode}),
        })
        return ({
            success: true,
            message: "Verification email sent successfully"
        })
    } catch (emailError) {
        console.log("Some problem crept in while sending verification email", emailError)
        return ({
            success: false,
            message: "Failed to send verification email"
        })
    }
}