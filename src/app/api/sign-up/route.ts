import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export const POST = async (request: Request) => {
    await dbConnect()

    try {
        // remember to put await
        const reqBody = await request.json()
        const { username, email, password } = reqBody

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            })
        }
        
        const existingUserByEmail = await UserModel.findOne({ email })

        if (existingUserByEmail) {
            //TODO: Add return response statement for user found using existing email
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            //Properties of object expiryDate are being modified not expiryDate itself
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []

            })

            await newUser.save()
        }

        //TODO:Send Verification Email

        const emailResponse: any = await sendVerificationEmail(email, username, verifyCode)
        // console.log("emailResponse :", emailResponse)

        if (!emailResponse) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please check your email box for verification"
        }, {
            status: 201
        })

    } catch (error) {
        console.log("Some error crept in while registering a new user", error)
        return Response.json({
            success: false,
            message: "Error registering new user"
        },
            {
                status: 500
            })
    }
}