import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";

export async function POST(request: Request) {
    await dbConnect()
    
    try {
        const body = await request.json()
        const result = resetPasswordSchema.safeParse(body)
        
        if (!result.success) {
            const errors = result.error.format();
            return Response.json({
                success: false,
                message: `Invalid input, ${JSON.stringify(errors)}`,
            }, {
                status: 400
            });
        }
        
        const { identifier, code, password } = result.data;
        
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
        
        // Verify code
        const isCodeValid = user.verifyCode.toString() === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        
        if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, {
                status: 400
            });
        }
        
        if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired"
            }, {
                status: 400
            });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Update user password and clear verification code
        user.password = hashedPassword;
        // user.verifyCode = 0; // Clear the verification code
        // user.verifyCodeExpiry = new Date(0); // Clear expiry
        await user.save();
        
        return Response.json({
            success: true,
            message: "Password reset successfully"
        }, {
            status: 200
        });
        
    } catch (error) {
        console.error("Error resetting password:", error);
        return Response.json({
            success: false,
            message: "Error resetting password"
        }, {
            status: 500
        });
    }
}