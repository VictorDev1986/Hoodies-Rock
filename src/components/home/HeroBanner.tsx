"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [
  {
    id: 1,
    badge: "Nueva colección",
    title: "Viste el",
    subtitle: "Rock",
    description: "Hoodies con actitud para quienes viven con el volumen al máximo.",
    cta: "Ver hoodies",
    href: "/products",
    gradient: "from-zinc-950 via-red-950 to-zinc-950",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000",
  },
  {
    id: 2,
    badge: "Estilo de escenario",
    title: "Camisetas que",
    subtitle: "Suenan fuerte",
    description: "Diseños que llevan tu música favorita del concierto a la calle.",
    cta: "Ver camisetas",
    href: "/products",
    gradient: "from-stone-950 via-neutral-800 to-red-950",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1000",
  },
  {
    id: 3,
    badge: "El toque final",
    title: "Gorras con",
    subtitle: "Actitud",
    description: "Completa tu look con piezas hechas para romper la rutina.",
    cta: "Explorar gorras",
    href: "/products",
    gradient: "from-neutral-950 via-zinc-800 to-red-950",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1000",
  },
]

export function HeroBanner() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="relative">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className={`relative overflow-hidden bg-gradient-to-br ${slide.gradient}`}>
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    className="object-cover"
                    priority={slide.id === 1}
                  />
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                  <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
                    {/* Text Content */}
                    <div className="max-w-xl text-center lg:text-left">
                      <span className="inline-block rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white mb-3">
                        {slide.badge}
                      </span>
                      <h2 className="font-(family-name:--font-display) text-5xl uppercase leading-[0.9] tracking-wide text-white sm:text-6xl lg:text-7xl">
                        {slide.title}
                        <span className="block text-primary">{slide.subtitle}</span>
                      </h2>
                      <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-md mx-auto lg:mx-0">
                        {slide.description}
                      </p>
                      <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                        <Button asChild size="default" className="bg-red-700 text-white hover:bg-red-800">
                          <Link href={slide.href}>{slide.cta}</Link>
                        </Button>
                        <Button asChild variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                          <Link href="/products">Ver Todo</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className="relative w-72 h-52 sm:w-96 sm:h-72 lg:w-[500px] lg:h-80">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full" />
                      <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-4 hidden sm:flex" />
        <CarouselNext className="right-4 hidden sm:flex" />

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className="h-1.5 w-6 rounded-full bg-white/30 transition-colors"
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
