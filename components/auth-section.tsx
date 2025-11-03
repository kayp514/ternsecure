"use client"

import { Card } from "@/components/ui/card"
import { Shield, Zap, Code2, Lock, RefreshCw, Users } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Built on Firebase Authentication with enterprise-grade security and token management.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for performance with automatic token refresh and session management.",
  },
  {
    icon: Code2,
    title: "Developer Friendly",
    description: "Simple hooks and utilities that integrate seamlessly with your existing codebase.",
  },
  {
    icon: Lock,
    title: "Custom Claims",
    description: "Manage user roles and permissions with built-in custom claims support.",
  },
  {
    icon: RefreshCw,
    title: "Auto Token Refresh",
    description: "Automatic token refresh handling keeps your users authenticated seamlessly.",
  },
  {
    icon: Users,
    title: "User Management",
    description: "Complete user session and authentication state management out of the box.",
  },
]

export function AuthenticationSection() {
  return (
    <section id="authentication" className="py-16 md:py-20 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Authentication Available Now</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to add secure authentication to your Next.js and React applications. Realtime and PubSub
            services in development.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
