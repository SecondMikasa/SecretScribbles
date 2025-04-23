"use client"
import { useCallback, useEffect, useState } from "react"

import {
  Loader2,
  RefreshCcw,
  Link,
  Copy,
  Bell,
  BellOff
} from "lucide-react"

import axios, { AxiosError } from "axios"

import { useSession } from "next-auth/react"

import { useForm } from "react-hook-form"

import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"

import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

import { Message } from "@/types/interfaces"
import { ApiResponse } from "@/types/ApiResponse"

import MessageCard from "./MessageCard"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { toast } = useToast()

  //Using optimised UI approach where we delete the specific message on frontend as soon as the task is performed and later update it on the backend
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => {
      return message._id !== messageId
    }))
  }

  const { data: session } = useSession()

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)

    try {
      const res = await axios.get<ApiResponse>('/api/accept-messages')

      if (typeof res.data.isAcceptingMessages === 'boolean') {
        setValue('acceptMessages', res.data.isAcceptingMessages)
      }
    }
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      })
    }
    finally {
      setIsSwitchLoading(false)
    }
  }, [setValue, toast])

  const fetchMessage = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)

    try {
      const res = await axios.get<ApiResponse>('/api/get-messages')

      // Check if the response contains messages and ensure they're valid
      if (res.data.messages && Array.isArray(res.data.messages)) {
        setMessages(res.data.messages)
      } else {
        setMessages([])
      }

      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages",
        })
      }

    }
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive"
      })
      setMessages([])
    }
    finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (!session || !session.user) return

    fetchMessage()
    fetchAcceptMessage()
  }, [session, fetchAcceptMessage, fetchMessage])

  //Handle Switch case
  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })

      setValue('acceptMessages', !acceptMessages)

      toast({
        title: res.data.message,
        variant: 'default'
      })
    }
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to update message settings",
        variant: "destructive"
      })
    }
  }

  if (!session || !session.user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-700">Access Required</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-gray-600">Please login to access the website contents</p>
            <Button className="bg-purple-600 hover:bg-purple-700" asChild>
              <a href="/sign-in">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { username } = session.user

  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "URL copied",
      description: "Profile URL has been copied to clipboard"
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Badge variant="outline" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
              </Badge>
            </div>
            <p className="mt-2 text-white/80">Manage your secret scribbles and profile settings</p>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Share Profile Section */}
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                <Link size={20} className="text-purple-500" />
                Your Profile Link
              </h2>
              <Card className="border border-purple-100 dark:border-purple-900 bg-purple-50 dark:bg-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        value={profileUrl}
                        readOnly
                        className="w-full rounded-md border border-gray-200 bg-white p-3 pr-12 text-sm focus:border-purple-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-sm text-gray-500">{username}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={copyToClipboard}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Copy size={16} className="mr-2" /> Copy
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Share this link with friends to receive anonymous messages
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Message Settings Section */}
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                {acceptMessages ? (
                  <Bell size={20} className="text-green-500" />
                ) : (
                  <BellOff size={20} className="text-red-500" />
                )}
                Message Settings
              </h2>
              <Card className="border border-gray-100 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">Accept New Messages</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {acceptMessages 
                          ? "You're currently receiving new messages" 
                          : "You're not accepting new messages"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${
                        acceptMessages ? "text-green-500" : "text-gray-500"
                      }`}>
                        {acceptMessages ? "On" : "Off"}
                      </span>
                      <Switch
                        {...register('acceptMessages')}
                        checked={acceptMessages}
                        onCheckedChange={handleSwitchChange}
                        disabled={isSwitchLoading}
                        className={`${
                          acceptMessages ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-6" />

            {/* Messages Section */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your Messages</h2>
                <Button
                  variant="outline"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    fetchMessage(true)
                  }}
                  className="border-purple-200 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-900 dark:hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCcw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>

              {messages.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {messages.map((message, index) => (
                    <MessageCard
                      key={message._id ? message._id.toString() : `message-${index}`}
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                      <Bell size={24} className="text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">No Messages Yet</h3>
                    <p className="max-w-md text-gray-500 dark:text-gray-400">
                      Share your profile link with friends to start receiving anonymous messages.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page