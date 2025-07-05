import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { forgotPasswordSchema } from "@/schemas/resetPasswordSchema";
import { sendPasswordResetEmail } from "@/helpers/sendPasswordResetEmail";

export async function POST(request: Request) {
    await dbConnect();
    
    try {
        const body = await request.json();
        const result = forgotPasswordSchema.safeParse(body);
        
        if (!result.success) {
            const errors = result.error.format();
            return Response.json({
                success: false,
                message: `Invalid input, ${JSON.stringify(errors)}`,
            }, {
                status: 400
            });
        }
        
        const { identifier } = result.data;
        
        // Find user by username or email
        const user = await UserModel.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        });
        
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            });
        }
        
        // Generate new verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000);
        const verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour
        
        // Update user with new verification code
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = verifyCodeExpiry;
        await user.save();
        
        // Send verification email
        const emailResponse = await sendPasswordResetEmail(
            user.email as string,
            user.username as string,
            verifyCode
        );
        
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: "Failed to send verification email"
            }, {
                status: 500
            });
        }
        
        return Response.json({
            success: true,
            message: "Verification code sent to your email"
        }, {
            status: 200
        });
        
    } catch (error) {
        console.error("Error in forgot password:", error);
        return Response.json({
            success: false,
            message: "Error processing forgot password request"
        }, {
            status: 500
        });
    }
}