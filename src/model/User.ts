import { Message, User } from '@/types/interfaces'
import mongoose, { Schema, model } from 'mongoose'
import { number } from 'zod'

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    }, 
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: Number,
        required: [true, "Verify token is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify token expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    // messages: [MessageSchema]
    // But we have a custom datatype of message (singular) of messages
    messages: [MessageSchema]
})

// Fetch existing UserModel and if model doesn't exist, create a model in our MongoDB database through mongoose and then fetch it
const UserModel =
    (mongoose.models.User as mongoose.Model<User>) // Creating User model in DB and then fetching it
    ||
    mongoose.model<User>("User", UserSchema) // Fetching existing model

export default UserModel