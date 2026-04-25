import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Specs } from "@/components/landing/specs";
import { Offers } from "@/components/landing/offers";
import { Pricing } from "@/components/landing/pricing";
import { DemoAndFaq } from "@/components/landing/demo-faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Specs />
      <Offers />
      <Pricing />
      <DemoAndFaq />
      <Footer />
    </main>
  );
}
