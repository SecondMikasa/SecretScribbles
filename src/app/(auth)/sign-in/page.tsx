"use client"
import { useState } from "react"
import {
  Loader2,
  User,
  Mail,
  Lock,
  ArrowRight,
  Key
} from "lucide-react"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { signIn } from "next-auth/react"

import { useForm } from "react-hook-form"

import * as z from "zod"
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

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)

    try {
      const res = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      });

      if (res?.error) {
        console.error('Sign in error:', res.error)
        
        // Handle specific error messages
        let errorMessage = "Sign in failed";
        
        if (res.error.includes('No user found')) {
          errorMessage = "No account found with this username or email"
        } else if (res.error.includes('verify your account')) {
          errorMessage = "Please verify your account before signing in"
        } else if (res.error.includes('Incorrect password')) {
          errorMessage = "Incorrect password";
        } else if (res.error.includes('identifier and password')) {
          errorMessage = "Please provide both username/email and password"
        } else {
          errorMessage = "Invalid credentials. Please check your username/email and password."
        }

        toast({
          title: "Sign In Failed",
          description: errorMessage,
          variant: "destructive"
        });
      } else if (res?.ok) {
        toast({
          title: "Success",
          description: "Signed in successfully!",
        })
        router.replace('/dashboard')
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left section - Illustration/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 justify-center items-center p-12">
        <div className="max-w-lg text-white">
          <h1 className="text-5xl font-bold mb-6">Secret Scribbles</h1>
          <p className="text-xl mb-8">Welcome back! Continue your anonymous journey and share your thoughts in a safe space.</p>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-4">
                <Key className="h-6 w-6" />
              </div>
              <p className="text-lg">Secure and private login</p>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-4">
                <Lock className="h-6 w-6" />
              </div>
              <p className="text-lg">Your identity remains protected</p>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-4">
                <User className="h-6 w-6" />
              </div>
              <p className="text-lg">Access your personal anonymous space</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right section - Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue your anonymous adventure</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Username or Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Mail className="h-5 w-5" />
                        </div>
                        <Input
                          className="pl-10 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter your username or email"
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
                    <div className="flex justify-between">
                      <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                      <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Lock className="h-5 w-5" />
                        </div>
                        <Input
                          className="pl-10 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          type="password"
                          placeholder="Enter your password"
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
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6 text-gray-600">
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage