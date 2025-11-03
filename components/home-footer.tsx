import Link from "next/link"
import { Shield, Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TernSecure</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Simplifying Firebase Authentication for Next.js and React applications.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://github.com/TernSecure/auth"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#authentication" className="text-muted-foreground transition-colors hover:text-foreground">
                  Authentication
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/50 cursor-not-allowed">Realtime (Coming Soon)</span>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground transition-colors hover:text-foreground">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.npmjs.com/package/@tern-secure/nextjs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  npm Package
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/TernSecure/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TernSecure.
          </p>
        </div>
      </div>
    </footer>
  )
}
