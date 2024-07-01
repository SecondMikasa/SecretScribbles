import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    //To Check Logged In status
    if (!session || !session.user) {
        return Response.json({
            success: true,
            message: 'Not Authenticated'
        }, {
            status: 401
        })
    }

    const userId = user._id
    const { acceptMessages } = await request.json()

    try {

        //By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.

        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: 'Failed to update user status to accept messages'
            },
                {
                    status: 401
                })
        }

        return Response.json({
            success: true,
            message: 'Message acceptance status updated successfully'
        },
            {
                status: 400
            })

    } catch (error) {
        console.log('Failed to update user status to accept messages')
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, {
            status: 500,
        })
    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    //To Check Logged In status
    if (!session || !session.user) {
        return Response.json({
            success: true,
            message: 'Not Authenticated'
        }, {
            status: 401
        })
    }

    const userId = user._id
    
    try {
        const requiredUser = await UserModel.findById(userId)
    
        if (!requiredUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 }
            )
        }
    
        return Response.json({
            success: true,
            isAcceptingMessages: requiredUser.isAcceptingMessages
        }, {
            status: 200
        })
    }
    catch (error) {
        console.log("Failed to fetch user status to accept messages")

        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, {
            status: 500
        })
    }
}