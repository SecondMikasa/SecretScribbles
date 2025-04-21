import { Document } from "mongoose"

export interface Message extends Document{
    content: string;
    createdAt: Date;
}

export interface User extends Document{
    username: String;
    email: String;
    password: String;
    verifyCode: Number;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}