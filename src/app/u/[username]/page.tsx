"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from "@/components/ui/textarea"
import { Separator } from '@/components/ui/separator'
import { Loader2, Send, MessageSquare, UserCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import axios, {AxiosError} from 'axios'
import { toast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'

const Page = () => {
  const params = useParams<{username: string}>()
  const username = params.username
  const [isLoading, setIsLoading] = useState(false)
  const [isMessageSent, setIsMessageSent] = useState(false)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    
    try {
      const res = await axios.post<ApiResponse>('/api/send-message', {
        username: username,
        content: data.content
      })
      
      toast({
        title: res.data.message,
        variant: 'default'
      })
      
      form.reset()
      setIsMessageSent(true)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Oopsie! Scribble failed to deliver",
        description: axiosError.response?.data.message ?? "Some error occurred while trying to send message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-8 text-center relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <UserCircle size={64} className="text-white" />
            </div>
            <div className="mt-12">
              <h1 className="text-3xl font-bold mt-4">@{username}</h1>
              <p className="text-white/80 mt-2">Send an anonymous message</p>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            {isMessageSent ? (
              <div className="text-center py-8">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <MessageSquare size={36} className="text-green-600 dark:text-green-300" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Message Sent!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Your anonymous message has been delivered successfully.</p>
                <Button 
                  onClick={() => setIsMessageSent(false)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-300">
                          Write your anonymous message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your thoughts anonymously..."
                            className="resize-none min-h-[150px] border-gray-300 dark:border-gray-700 focus:border-purple-400 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 focus:ring-opacity-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Your message will be completely anonymous. The recipient won&apos;t know who sent it.
                        </p>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-center">
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition-all"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} className="mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            )}
          </CardContent>
          
          <Separator className="my-0" />
          
          <CardFooter className="p-6 bg-gray-50 dark:bg-gray-800/50 flex flex-col">
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">Want to receive anonymous messages too?</p>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white">
                  Create Your Account
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Page