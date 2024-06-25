import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",

            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text", placeholder: "Jsmith@gmail.com" },

                password: { label: "Password", type: "password", placeholder: "123456" }
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnect()

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error('No user found with this email')
                    }

                    if (!user.isVerified) {
                        throw new Error('Please verify your account before login')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password.toString())

                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error('Incorrect Password')
                    }
                } catch (error) {
                    throw new Error
                }
            }
        })
    ],

    callbacks: {
        //TODO: JWT se mila user, user --> token --> session
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id,
                token.isVerified = user.isVerified,
                token.isAcceptingMessages = user.isAcceptingMessages,
                token.username = user.username
            }

            return token
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        }
    },

    pages: {
        signIn: '/sign-in',   
    },

    session: {
        strategy: "jwt"
    },

    secret: process.env.NEXTAUTH_SECRET,
    
}