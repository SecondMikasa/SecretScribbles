import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    await dbConnect()

    const messageId = params.messageId

    const session = await getServerSession(authOptions)
    const user: User = await session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: true,
            message: 'Not Authenticated'
        }, {
            status: 401
        })
    }

    try {
        
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: {messages: {_id: messageId}} }
        )
        
        //Indicates how many documents were modified by the update operation
        if (updatedResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, {
            status: 200
        })        

    } catch (error) {
        
        console.log("Failed to delete messages", error)

        return Response.json({
            success: false,
            message: "Error in delete messages"
        }, {
            status: 400
        })

    }
    
}