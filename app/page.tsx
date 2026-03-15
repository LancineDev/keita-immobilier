import { Header } from "@/components/header"
import { HeroSearch } from "@/components/hero-search"
import { Philosophy, Features } from "@/components/philosophy"
import { StatsSection } from "@/components/stats-section"
import { NewsSection } from "@/components/news-section"
import { Exclusivities } from "@/components/exclusivities"
import { RecentListings } from "@/components/recent-listings"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/footer"

const pulseStyle: React.CSSProperties = {
  animation: "pulse-scale 4s ease-in-out infinite",
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
      `}</style>

      <Header />
      <HeroSearch />
      <Philosophy />
      <StatsSection />
      <NewsSection />

      {/* Exclusivités */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Exclusivités</h3>
        <Link href="/property" className="block overflow-hidden rounded-lg hover:opacity-90 transition-opacity">
          <div className="relative">
            <div className="absolute left-2 top-2 z-10 rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">EXCLUSIVITÉ</div>
            <div className="absolute right-2 top-2 z-10 rounded bg-gray-800 px-2 py-0.5 text-xs font-bold text-white">VENTE</div>
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500"
                alt="Exclusivité"
                fill
                className="object-cover"
                style={pulseStyle}
              />
            </div>
            <div className="bg-gray-800 py-2 text-center">
              <p className="font-bold text-white">264.000.000 FCFA</p>
            </div>
          </div>
        </Link>
      </div>

      <Footer />
    </main>
  )
}