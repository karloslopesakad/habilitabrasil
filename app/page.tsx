import Hero from "@/components/sections/Hero";
import Benefits from "@/components/sections/Benefits";
import Packages from "@/components/sections/Packages";
import Testimonials from "@/components/sections/Testimonials";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Benefits />
      <Packages />
      <Testimonials />
      <Footer />
    </main>
  );
}

