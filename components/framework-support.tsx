"use client"

import { Card } from "@/components/ui/card"
import { Check, Clock } from "lucide-react"

const frameworks = [
  {
    name: "Next.js",
    versions: "13, 14, 15, 16",
    status: "ready",
    description: "Full support for App Router",
  },
  {
    name: "React",
    versions: "19+",
    status: "ready",
    description: "Works with any React application",
  },
  {
    name: "TanStack Start",
    versions: "Coming Soon",
    status: "development",
    description: "Support in active development",
  },
]

export function FrameworkSupport() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Framework Support</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Built for Next.js and React, with more frameworks on the way.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {frameworks.map((framework, index) => (
            <Card
              key={framework.name}
              className="p-6 border-border bg-card animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold">{framework.name}</h3>
                {framework.status === "ready" ? (
                  <div className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                    <Check className="h-3 w-3" />
                    Ready
                  </div>
                ) : (
                  <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    In Dev
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{framework.versions}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{framework.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
