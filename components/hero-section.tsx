"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {

  return (
    <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-12 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Authentication Ready
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Firebase Authentication
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground text-balance leading-relaxed sm:text-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            The complete Firebase toolkit for React. Start with authentication today.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button size="lg" className="group" asChild>
              <a href="#authentication">
                Explore Authentication
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
