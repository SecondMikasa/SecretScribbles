"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from "@/data/messages.json"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

const page = () => {
  return (
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12 '>
        <h1 className='font-bold text-3xl md:text-5xl'>
          Dive into the World of Anonymous Conversations
        </h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>
          Explore Secret Scribbles - which lets your Identity remain a mystery all the while enabling you to send messages you want to send
        </p>
      </section>
      <Carousel
        plugins={[Autoplay({
          delay: 2000
        })]}
        className="w-full max-w-xs">
        <CarouselContent>
          {
            messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                  <Card>
                    <CardHeader>
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg font-semibold">
                      {message.content}
                      </span>
                    </CardContent>
                    <CardFooter>
                        {message.received}
                    </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              )
            )
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  )
}

export default page