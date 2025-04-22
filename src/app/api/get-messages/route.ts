import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User | undefined = session?.user as User | undefined

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not Authenticated'
        }, {
            status: 401
        })
    }

    if (!user) {
        return Response.json({
            success: false,
            message: 'Unauthorized'
        }, {
            status: 401
        });
    }

    //TODO:While using aggregation pipeline, we can't treat _id as a string
    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "Some error occured while locating user"
            }, {
                status: 401
            })
        }

        return Response.json({
            success: true,
            //We are unwinding, making every element of array into a full fledged object
            messages: user[0].messages
        }, {
            status: 200
        })

    } catch (error) {
        
        console.log("Failed to get messages")

        return Response.json({
            success: false,
            message: "Error in retrieving messages"
        }, {
            status: 500
        })

    }
    
}