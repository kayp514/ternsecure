"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const syntaxHighlight = (code: string) => {
  // First escape HTML entities
  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  // Split into lines to preserve structure
  const lines = code.split("\n");

  return lines
    .map((line) => {
      // Escape HTML first
      let result = escapeHtml(line);

      // Check if line is a comment
      if (line.trim().startsWith("//")) {
        return `<span class="text-[#6A9955]">${result}</span>`;
      }

      const stringPlaceholders: string[] = [];
      
      // Extract and protect strings from further processing
      result = result.replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, (match) => {
        const placeholder = `__STRING_${stringPlaceholders.length}__`;
        stringPlaceholders.push(`<span class="text-[#CE9178]">${match}</span>`);
        return placeholder;
      });

      // Keywords
      result = result.replace(
        /\b(import|export|from|default|as|const|let|var|function|return|if|else|async|await|new|typeof)\b/g,
        '<span class="text-[#569CD6]">$1</span>'
      );

      // Booleans and special values
      result = result.replace(
        /\b(true|false|null|undefined)\b/g,
        '<span class="text-[#569CD6]">$1</span>'
      );

      // JSX/HTML tags - opening and closing with proper color
      result = result.replace(
        /(&lt;\/?)([A-Z][a-zA-Z0-9]*)(&gt;)/g,
        '$1<span class="text-[#4EC9B0]">$2</span>$3'
      );

      // Types/Components (PascalCase) - but not already in spans
      result = result.replace(
        /\b([A-Z][a-zA-Z0-9]*)\b/g,
        '<span class="text-[#4EC9B0]">$1</span>'
      );

      // Function calls
      result = result.replace(
        /\b([a-z][a-zA-Z0-9]*)\s*(?=\()/g,
        '<span class="text-[#DCDCAA]">$1</span>'
      );

      // Restore strings
      stringPlaceholders.forEach((str, i) => {
        result = result.replace(`__STRING_${i}__`, str);
      });

      return result;
    })
    .join("\n");
};

const codeExamples = {
  proxy: `// proxy.ts
import { ternSecureProxy, createRouteMatcher } from '@tern-secure/nextjs/server'

const publicPaths = createRouteMatcher([
  '/sign-in',
  '/sign-up',
  '/unauthorized',
  '/api/auth/(.*)',
  '/__/auth/(.*)',
  '/__/firebase/(.*)'
])

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

export default ternSecureProxy()
`,
  provider: `// app/layout.tsx
import { TernSecureProvider } from '@tern-secure/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TernSecureProvider>
      {children}
    </TernSecureProvider>
  )
}`,
  client: `// app/page.tsx
'use client'

import { useAuth } from '@tern-secure/nextjs'

export default function HomePage() {
  const { userId, user, isAuthenticated } = useAuth()

  if (!userId) return <div> loading... </div>

  if (!isAuthenticated) return <div> please verify your email </div>

  return (
    <div>
      <h1>Client page</h1>
      <p>Welcome, {user?.email}!</p>
    </div>
  )
}`,
  server: `// app/protected/page.tsx
import { auth } from '@tern-secure/nextjs/server'

export default async function ProtectedPage() {
  const { user, require, redirectToSignIn } = await auth()

  if (!require({ role: 'admin' })) return <div> access denied </div>

  if (!user) return redirectToSignIn()

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  )
}`,
};

export function CodeDemo() {
  const [activeTab, setActiveTab] = useState("proxy");
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsTyping(true);
    setDisplayedCode("");
    const code = codeExamples[activeTab as keyof typeof codeExamples];
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < code.length) {
        setDisplayedCode(code.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 10); // Faster typing speed for better streaming effect

    return () => clearInterval(typingInterval);
  }, [activeTab]);

  return (
    <section className="py-16 md:py-20 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              See It In Action
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Watch how easy it is to integrate TernSecure authentication into
              your Next.js app
            </p>
          </div>

          <Card className="overflow-hidden border-border bg-[#1e1e1e] shadow-2xl">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-border/50 bg-[#252526] px-6 py-2 flex items-center gap-2">
                <div className="flex gap-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <TabsList className="bg-transparent border-0 p-0 h-auto gap-1">
                  <TabsTrigger
                    value="proxy"
                    className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-white text-gray-400 hover:text-gray-300 rounded-t-md px-3 py-2 text-xs sm:text-sm sm:px-4 transition-all border-t-2 border-transparent data-[state=active]:border-primary"
                  >
                    proxy.ts
                  </TabsTrigger>
                  <TabsTrigger
                    value="provider"
                    className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-white text-gray-400 hover:text-gray-300 rounded-t-md px-3 py-2 text-xs sm:text-sm sm:px-4 transition-all border-t-2 border-transparent data-[state=active]:border-primary"
                  >
                    layout.tsx
                  </TabsTrigger>
                  <TabsTrigger
                    value="client"
                    className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-white text-gray-400 hover:text-gray-300 rounded-t-md px-3 py-2 text-xs sm:text-sm sm:px-4 transition-all border-t-2 border-transparent data-[state=active]:border-primary"
                  >
                    client side
                  </TabsTrigger>
                  <TabsTrigger
                    value="server"
                    className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-white text-gray-400 hover:text-gray-300 rounded-t-md px-3 py-2 text-xs sm:text-sm sm:px-4 transition-all border-t-2 border-transparent data-[state=active]:border-primary"
                  >
                    server side
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="relative">
                <TabsContent value="proxy" className="m-0 p-0">
                  <CodeBlock code={displayedCode} isTyping={isTyping} />
                </TabsContent>
                <TabsContent value="provider" className="m-0 p-0">
                  <CodeBlock code={displayedCode} isTyping={isTyping} />
                </TabsContent>
                <TabsContent value="client" className="m-0 p-0">
                  <CodeBlock code={displayedCode} isTyping={isTyping} />
                </TabsContent>
                <TabsContent value="server" className="m-0 p-0">
                  <CodeBlock code={displayedCode} isTyping={isTyping} />
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  );
}

function CodeBlock({ code, isTyping }: { code: string; isTyping: boolean }) {
  const highlightedCode = syntaxHighlight(code);

  return (
    <div className="relative bg-[#1e1e1e]">
      <div className="flex">
        <div className="select-none py-6 px-3 text-right text-[#858585] text-sm font-mono border-r border-[#2d2d2d] bg-[#1e1e1e] min-w-[3rem]">
          {code.split("\n").map((_, i) => (
            <div key={i} className="leading-6 h-6">
              {i + 1}
            </div>
          ))}
        </div>
        <pre className="flex-1 font-mono text-sm overflow-x-auto p-6 min-h-[400px] max-h-[500px]">
          <code
            className="text-[#D4D4D4]"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
          {isTyping && (
            <span
              className="inline-block w-[2px] h-5 bg-[#007ACC] ml-[2px] animate-pulse"
              style={{
                animation: "pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          )}
        </pre>
      </div>
    </div>
  );
}
