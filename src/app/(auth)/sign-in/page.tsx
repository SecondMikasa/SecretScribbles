"use client"
import { useState } from "react"

import { Loader2 } from "lucide-react"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { signIn } from "next-auth/react"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { signInSchema } from "@/schemas/signInSchema"

import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({

    //zodResolver cannot work on it's own. It needs a Schema to work
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  //data is the values enetered into the form (username, email & password in this case)
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {

    console.log("OnSubmit Data: ", data)
    setIsSubmitting(true)

    const res = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    console.log(res)
    if (res?.error) {
      if (res?.error == 'CredentialsSignin ') {
        toast({
          title: "Login failed",
          description: res.error,
          variant: "destructive"
        })
      }
      else {
        toast({
          title: "Login failed",
          description: "Incorrect username or password",
          variant: "destructive"
        })
      }
    }

    //Next-Auth signs in through giving back an URL
    else if (res?.url) {
      setIsSubmitting(false)
      router.replace('/dashboard')
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
              Signin to continue your anonymous adventure
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
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
                        placeholder=""
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
                    'Signin'
                  )
                }
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default page