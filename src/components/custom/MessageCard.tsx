import {
    Card, CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "../ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "../ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "../ui/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId : string) => void 
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    
    const {toast} = useToast()
    
    const handleDeleteConfirm = async () => {
        try {
            const res = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)

            toast({
                title: res.data.message,
            })

            if (typeof message._id === "string") { 
                onMessageDelete(message._id) 
            }
            else {
                toast({
                    title: "Failed to delete message"
                })
            }
            
        } catch (error) {
            
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button variant="destructive">
                                <X className="w-5 h-5"/>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
        </>
    )
}

export default MessageCard