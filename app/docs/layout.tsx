import { source } from "@/lib/source";
import { DocsLayout } from "@/components/layout/docs";
import { baseOptions } from "@/lib/layout.shared";
import { BookOpen, FileText, Settings, Shield } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const base = baseOptions();

  const tabs = [
    {
      title: "Next.js",
      description: "Next.js framework",
      url: "/docs/nextjs/getting-started",
      sdk: "nextjs",
      icon: <BookOpen className="size-4" />,
    },
    {
      title: "React",
      description: "React framework",
      url: "/docs/react/getting-started",
      sdk: "react",
      icon: <FileText className="size-4" />,
    },
  ];

  const navigation = [
    {
      title: "Getting Started",
      icon: <BookOpen className="size-4" />,
      url: "/docs/getting-started/installation",
      items: [
        {
          title: "Installation",
          url: "/docs/getting-started/installation",
        },
        {
          title: "Configuration",
          url: "/docs/${sdk}/configuration",
        },
      ],
    },
    {
      title: "Guides",
      icon: <FileText className="size-4" />,
      url: "/docs/guides/overview",
      items: [
        {
          title: "Overview",
          url: "/docs/guides/overview",
        },
        {
          title: "Authentication Flows",
          collapsible: true,
          items: [
            { title: "Custom Sign-In", url: "/docs/guides/authentication-flows/custom-sign-in" },
            { title: "Custom Sign-Up", url: "/docs/guides/authentication-flows/custom-sign-up" },
          ],
        },
        {title: "Auth State Persistence", url: "/docs/guides/authstate-persistence"},
      ],
    },
    {
      title: "Firebase",
      icon: <Settings className="size-4" />,
      url: "/docs/firebase/overview",
      collapsible: false,
      items: [
        {
          title: "Overview",
          url: "/docs/firebase/overview",
        },
        {
          title: "Initialize Authentication SDK",
          url: "/docs/firebase/initialize",
        },
        {
          title: "Authorized Domains & Redirect URIs",
          url: "/docs/firebase/authorized-domains",
        },
        {
          title: "Best Practices for signInWithRedirect",
          url: "/docs/firebase/redirect-best-practices",
        },
      ],
    },
    {
      title: "API Reference",
      icon: <Shield className="size-4" />,
      collapsible: true,
      items: [
        { title: "ternSecureProxy()", url: "/docs/reference/proxy" },
        { title: "ternSecureInstrumentation()", url: "/docs/reference/instrumentation" },
      ],
    },
  ];

  return (
    <DocsLayout
      tree={source.pageTree}
      {...base}
      nav={{
        title: 'TernSecure Auth Docs',
        url: '/docs',
      }}
      sidebar={{
        tabs,
        navigation,
      }}
    >
      {children}
    </DocsLayout>
  );
}
