import React from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from "@/data/messages.json"
import Autoplay from "embla-carousel-react"
import { Card, CardContent } from '@/components/ui/card'

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
        plugins={Autoplay}
        className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
  )
}

export default page