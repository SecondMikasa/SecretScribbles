"use client"
import { useParams, useRouter } from 'next/navigation'
import axios, { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from "@/types/ApiResponse"
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { useToast } from '@/components/ui/use-toast'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Page = () => {
    const router = useRouter()
    const param = useParams<{ username: string }>()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const res = await axios.post('/api/verify-code', {
                username: param.username,
                code: data.code
            })

            toast({
                title: "Success",
                description: res.data.message
            })

            // Changed redirect from 'sign-in' to 'dashboard'
            router.replace('/dashboard')
        } catch (error) {
            console.error("Error verifying account:", error)
            let axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message

            toast({
                title: "Verification failed",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }

    return (
        <>
            <div className='flex justify-center items-center min-h-screen bg-gray-100'>
                <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        </h1>
                        <p className='mb-4'>
                            Enter the verification code sent to your email address
                        </p>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Verification Code
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter 6-digit code"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                Verify Account
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Page