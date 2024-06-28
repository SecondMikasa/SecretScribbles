"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormControl, FormDescription, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const page = () => {

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
                    console.log(res)
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

        console.log("OnSubmit Data: ", data)
        setIsSubmitting(true)

        try {

            const response = await axios.post<ApiResponse>('/api/sign-up', data)

            toast({
                title: 'Success',
                description: response.data.message
            })

            router.replace(`/verify/${username}`)
            setIsSubmitting(false)

        } catch (error) {

            console.log("Some error occured while signing you up")
            let axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message

            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }

    return (
        <>

            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Join Secret Scribbles
                        </h1>
                        <p className="mb-4">
                            Signup to start your anonymous adventure
                        </p>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                {...field}
                                                onChange={(e) => {
                                                    //Not needed generally as react-hook-forms manage it automatcally but here added because of debouncedValue
                                                    field.onChange(e)
                                                    debounced(e.target.value)
                                                }}
                                            />
                                        </FormControl>
                                        {isCheckingUsername && <Loader2 className="animate-spin" />}
                                        <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                                            {/* {`"${username}" `} */}{usernameMessage}  
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="johndoe@gmail.com"
                                                {...field}
                                            />
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
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="12345"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ?
                                    (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                        </>
                                    ) :
                                    (
                                        'Signup'
                                    )
                                }
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4">
                        <p>
                            Already a member?{' '}
                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page