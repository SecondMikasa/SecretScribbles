import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

const verifyCodeSchema = verifySchema

export async function POST(request: Request) {
    await dbConnect()

    try {
        //Data can be send both ways through URL and body. Depends upon the developer
        const body = await request.json()
        const result = verifyCodeSchema.safeParse(body)

        if (!result.success) {
            const errors = result.error.format();
            return Response.json({
                success: false,
                message: `Invalid input, ${errors}`,
            }, {
                status: 400
            })
        }

        const { username, code } = result.data

        //TODO: Used when accessing URL parameters. Just for showcase here
        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedUsername })
        
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
            {status: 500}
            )
        }

        const isCodeValid = user.verifyCode.toString() === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            },
            { status: 201}
            )
        }
        else if (!isCodeValid){
            return Response.json({
                success: false,
                message: "Code is not valid. Please recheck and try again"
            },
            {status: 400}
            )
        }
        else {
            return Response.json({
                success: false,
                message: "Code has expired"
            },
            {status: 400}
            )
        }
        
    }
    catch (error) {
        console.log("Error verifying user", error)
        
        return Response.json({
            success: false,
            message: "Error verifying user"
        },
            {
                status: 500
            })
    }
    
} 