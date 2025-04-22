"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, RefreshCcw } from "lucide-react"

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
      <div>
        Please login to access the website contents
      </div>
    )
  }

  const { username } = session.user

  // NOTE: Claude generated shit
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
    <>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">
          User Dashboard
        </h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">
            Copy Your Unique Link
          </h2>
          {' '}
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button
              onClick={copyToClipboard}
            >
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>
        <Separator />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessage(true);
          }}
        >
          {
            isLoading ? (
              <Loader2
                className="h-4 w-4 animate-spin"
              />
          ) : (
                <RefreshCcw
                  className="h-4 w-4"
                />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {
            messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={message._id ? message._id.toString() : `message-${index}`}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
                <p>
                  No messages to display.
                </p>
          )}
        </div>
      </div>
    </>
  )
}

export default Page