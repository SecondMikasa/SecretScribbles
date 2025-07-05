import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resend";
import PasswordResetEmail from "../../emails/PasswordResetEmail";

export async function sendPasswordResetEmail(
    email: string,
    username: string,
    verifyCode: number
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'SecondMikasa <onboarding@resend.dev>',
            to: email,
            subject: 'Password Reset Code | Secret Scribbles',
            react: PasswordResetEmail({
                username,
                otp: verifyCode
            }),
        });
       
        return ({
            success: true,
            message: "Password reset email sent successfully"
        });
    } catch (emailError) {
        console.log("Some problem crept in while sending password reset email", emailError);
        return ({
            success: false,
            message: "Failed to send password reset email"
        });
    }
}