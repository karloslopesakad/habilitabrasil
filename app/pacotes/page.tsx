import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Packages from "@/components/sections/Packages";

export default function PacotesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24">
        <Packages />
      </div>
      <Footer />
    </main>
  );
}

