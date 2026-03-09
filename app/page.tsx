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
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSearch />
      <Philosophy />
      <StatsSection />
      <NewsSection />
      <Exclusivities />  
      <Footer />
    </main>
  )
}
