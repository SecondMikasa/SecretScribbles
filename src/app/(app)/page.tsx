"use client"
import Link from 'next/link'

import { User } from 'next-auth'
import { useSession } from 'next-auth/react'

import {
  MessageCircle,
  Lock,
  Shield,
  Sparkles
} from "lucide-react"

import messages from "@/data/messages.json"
import testimonials from "@/data/testimonials.json"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import Autoplay from "embla-carousel-autoplay"

const LandingPage = () => {
  const { data: session } = useSession()
  const user: User | undefined = session?.user as User | undefined

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-6">
            Dive into the World of Anonymous Conversations
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Explore Secret Scribbles - where your identity remains a mystery while enabling you to express yourself freely and authentically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {
              user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8">
                    Get Started
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-in">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8">
                    Get Started
                  </Button>
                </Link>
              )
            }
            <Link href="/about">
              <Button size="lg" variant="outline" className="font-medium">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Message Carousel Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Real Conversations, Real Anonymity
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse through some of the heartfelt messages shared by our community
            </p>
          </div>

          <div className="flex justify-center">
            <Carousel
              plugins={[Autoplay({
                delay: 3000
              })]}
              className="w-full max-w-md md:max-w-xl">
              <CarouselContent>
                {
                  messages.map((message, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="pb-2 font-semibold text-lg text-purple-600 dark:text-purple-400">
                            {message.title}
                          </CardHeader>
                          <CardContent className="flex aspect-square items-center justify-center p-6 text-gray-800 dark:text-gray-200">
                            <span className="text-lg font-medium italic">
                              &quot;{message.content}&quot;
                            </span>
                          </CardContent>
                          <CardFooter className="text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                            <span>
                              {message.received}
                            </span>
                            <span>
                              Anonymous
                            </span>
                          </CardFooter>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))
                }
              </CarouselContent>
              <CarouselPrevious className="bg-white dark:bg-gray-700 shadow-md" />
              <CarouselNext className="bg-white dark:bg-gray-700 shadow-md" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Secret Scribbles?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform offers a unique way to connect with others
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Lock className="text-purple-600 dark:text-purple-300" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Complete Anonymity
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your identity remains private, giving you the freedom to express yourself without constraints.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <MessageCircle
                  className="text-pink-600 dark:text-pink-300"
                  size={24}
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Genuine Connections
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Form meaningful relationships based on authentic conversations without judgement.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Shield className="text-blue-600 dark:text-blue-300" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Safe Environment
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We prioritize user safety with moderation tools and community guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles size={32} className="text-yellow-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Share Your Secret Scribbles?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of users who have discovered the freedom of anonymous expression.
          </p>
          <Link href="/sign-in">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-medium px-8">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              What Our Users Say
            </h2>
            <p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Don&apos;t just take our word for it - hear from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {
              testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow"
                >
                  <p
                    className="italic text-gray-700 dark:text-gray-300 mb-4"
                  >
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <p
                    className="font-medium text-purple-600 dark:text-purple-400"
                  >
                    — {testimonial.author}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default LandingPage