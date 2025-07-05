import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()

        const verifyCode = Math.floor(100000 + Math.random() * 900000)
        
        // [x]: Checks for unique username
        const existingUserByUsername = await UserModel.findOne({
            username,
        })

        if (existingUserByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            })
        }
        
        // [x]: Checks for unique email
        const existingUserByEmail = await UserModel.findOne({ email })

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "This email has already been registered by an user"
                }, {
                    status: 400
                })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)

                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save()
        }
        
        // [x]: Sending verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: `Failed to send verification code, ${emailResponse.message}`
            }, {
                status: 500
            })
        }
        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, {
            status: 201
        })

    }
    catch (error) {
        console.error("Some error occured while registering user", error)

        return Response.json(
            {
                success: false,
                message: "Error occurred while registering user"
            },
            {
                status: 500
            }
        )
    }
}