import { HeroSection } from "@/components/hero-section";
import { AuthenticationSection } from "@/components/auth-section";
import { FrameworkSupport } from "@/components/framework-support";
import { CodeDemo } from "@/components/code-demo";
import { Footer } from "@/components/home-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <AuthenticationSection />
        <CodeDemo />
        <FrameworkSupport />
      </main>
      <Footer />
    </div>
  );
}
