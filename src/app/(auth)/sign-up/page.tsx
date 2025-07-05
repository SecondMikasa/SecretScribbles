"use client"
import { useEffect, useState } from "react"
import {
    Loader2,
    User,
    Mail,
    Lock,
    ArrowRight
} from "lucide-react"

import Link from "next/link"
import { useRouter } from "next/navigation"

import axios, { AxiosError } from "axios"

import { useForm } from "react-hook-form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useDebounceCallback } from 'usehooks-ts'

import { signUpSchema } from "@/schemas/signUpSchema"

import { ApiResponse } from "@/types/ApiResponse"

import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SignUpPage = () => {

    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    //Will let you update the value of username after a period of time instead of being changed for each event fired
    const debounced = useDebounceCallback(setUsername, 500)

    const { toast } = useToast()
    const router = useRouter()

    // TODO: Implementation of Zod
    const form = useForm<z.infer<typeof signUpSchema>>({

        //zodResolver cannot work on it's own. It needs a Schema to work
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    // TODO: To check whether Usernam is available or not
    useEffect(() => {
        const checkUsernameUnique = async () => {

            if (username) {

                setIsCheckingUsername(true)
                setUsernameMessage('')

                try {

                    const res = await axios.get(`api/check-username-unique?username=${username}`)
                    setUsernameMessage(res.data.message)

                } catch (error) {

                    //TODO: Handling axios errors
                    const axiosError = error as AxiosError<ApiResponse>

                    //"??" operator returns the first argument if it is not nullish (null or undefined).Otherwise it returns the second argument.
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")

                } finally {

                    setIsCheckingUsername(false)

                }

            }
        }

        checkUsernameUnique()
    }, [username])

    //data is the values enetered into the form (username, email & password in this case)
    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)

        try {

            const response = await axios.post<ApiResponse>('/api/sign-up', data)

            toast({
                title: 'Success',
                description: response.data.message
            })

            router.replace(`/verify/${username}`)
            setIsSubmitting(false)

        }
        catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message

            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"
            })
        }
        finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 justify-center items-center p-12">
                <div className="max-w-lg text-white">
                    <h1 className="text-5xl font-bold mb-6">
                        Secret Scribbles
                    </h1>

                    <p className="text-xl mb-8">
                        Share your thoughts anonymously and connect with like-minded individuals in a safe space.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center">
                            <div className="bg-white/20 rounded-full p-2 mr-4">
                                <User
                                    className="h-6 w-6"
                                />
                            </div>

                            <p className="text-lg">
                                Create a unique anonymous identity
                            </p>
                        </div>

                        <div className="flex items-center">
                            <div className="bg-white/20 rounded-full p-2 mr-4">
                                <Lock
                                    className="h-6 w-6"
                                />
                            </div>

                            <p className="text-lg">
                                Your personal information stays private
                            </p>
                        </div>

                        <div className="flex items-center">
                            <div className="bg-white/20 rounded-full p-2 mr-4">
                                <Mail
                                    className="h-6 w-6"
                                />
                            </div>
                            <p className="text-lg">
                                Connect through verified email
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-8">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Join Secret Scribbles
                        </h2>

                        <p className="text-gray-600">
                            Start your anonymous adventure today
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <div className="absolute left-3 top-3 text-gray-400">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <Input
                                                    className="pl-10 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Choose a unique username"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        debounced(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <div className="h-6 mt-1">
                                            {isCheckingUsername ? (
                                                <div className="flex items-center text-gray-500">
                                                    <Loader2 className="animate-spin h-4 w-4 mr-2" /> Checking availability...
                                                </div>
                                            ) : (
                                                <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                                                    {usernameMessage}
                                                </p>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <div className="absolute left-3 top-3 text-gray-400">
                                                    <Mail className="h-5 w-5" />
                                                </div>
                                                <Input
                                                    className="pl-10 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Enter your email"
                                                    type="email"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <div className="absolute left-3 top-3 text-gray-400">
                                                    <Lock className="h-5 w-5" />
                                                </div>
                                                <Input
                                                    className="pl-10 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Create a strong password"
                                                    type="password"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center"
                            >
                                {
                                    isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Creating your account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )
                                }
                            </Button>
                        </form>
                    </Form>

                    <div className="text-center mt-6 text-gray-600">
                        <p>
                            Already a member?{' '}
                            <Link
                                href="/sign-in"
                                className="text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage