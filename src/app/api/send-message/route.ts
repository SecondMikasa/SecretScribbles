import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()

    try {

        const requiredUser = await UserModel.findOne({ username })

        if (!requiredUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 }
            )
        }

        //TODO: Is user accepting messages
        const isAcceptingMessages = requiredUser.isAcceptingMessage

        if (!isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not currently accepting messages"
            },
                { status: 403 }
            )
        }

        const newMessage = { content, createdAt: new Date() }
        requiredUser.messages.push(newMessage as Message)

        await requiredUser.save()

        return Response.json({
            success: true,
            message: "Message has been sent to the user successfully"
        },
            { status: 201 }
        )

    } catch (error) {
        console.log("Unexpected Error Occured :", error)

        return Response.json({
                success: false,
                message: "Unexpected error occured while trying to send message to the user"
            },
                { status: 500 }
            )
    }   
}

