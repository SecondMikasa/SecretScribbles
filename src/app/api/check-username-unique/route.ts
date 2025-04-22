import { z } from "zod";

import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import { usernameValidation } from "@/schemas/signUpSchema";

//Handle username issues on frontend only
const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {

    //FIXME: Prevent wrong method --> Not required anymore in latest NextJS version
    // if (request.method !== 'GET') {
    //     return Response.json({
    //         success: false,
    //         message: 'Method not allowed'
    //     }, { 
    //         status: 405 
    //     })
    // }

    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)

        const queryParams = {
            username: searchParams.get('username')
        }

        //Validation with Zod --> takes object
        const result = UsernameQuerySchema.safeParse(queryParams)
        // console.log("result: ", result)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ?
                    usernameErrors.join(', ') :
                    'Invalid query parameters'
            },
                {
                    status: 400
                }
            )
        }

        const { username } = result.data

        const existingUserByUsername = await UserModel.findOne({
            username,
        })
        if (existingUserByUsername) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, {
                status: 200
            })
        }

        //Will be returned if username is unique 
        return Response.json(
            {
                success: true,
                message: 'Username is unique'
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error checking username", error)

        return Response.json({
            success: false,
            message: "Error checking username"
        },
            {
                status: 500
            })
    }
}