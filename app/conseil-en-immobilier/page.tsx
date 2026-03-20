"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import conseilImage from "@/app/assets/conseil.jpg"

const pulseStyle: React.CSSProperties = {
  animation: "pulse-scale 4s ease-in-out infinite",
}

const articles = [
  {
    title: "Le SYNDIC de Copropriété",
    tags: [
      { label: "Définition du mois", href: "/articles/syndic-copropriete" },
      { label: "lexique immobilier", href: "/lexique-immobilier" },
    ],
    excerpt: "Le SYNDIC de Copropriété est une personne physique ou morale désignée par l'ensemble des...",
    image: conseilImage,
    date: "Oct 2020",
    href: "/articles/syndic-copropriete",
  },
  {
    title: "5 Astuces déco pour relooker votre salon sans vous ruiner",
    tags: [
      { label: "immobilier", href: "/articles/5-astuces-deco" },
      { label: "Décoration", href: "/decoration" },
    ],
    excerpt: "La déco de votre salon vous déprime ? Vous avez des envies de changements ? Le salon est...",
    image: conseilImage,
    date: "",
    href: "/articles/5-astuces-deco",
  },
  {
    title: "Découvrez le Centre d'Affaires de KEITA",
    tags: [
      { label: "KEITA Centre d'Affaires", href: "/keita-centre-affaires" },
      { label: "Centre d'Affaires", href: "/centre-affaires" },
      { label: "Domiciliation", href: "/centre-affaires/domiciliation" },
    ],
    excerpt: "Ouvert depuis 2015 pour répondre aux besoins spécifiques de la clientèle...",
    image: conseilImage,
    date: "",
    href: "/articles/centre-affaires-kalimba",
  },
  {
    title: 'Les « Maisons Clous » en Chine',
    tags: [
      { label: "Le Saviez-Vous ?", href: "/articles/maisons-clous-chine" },
    ],
    excerpt: "Découvertes surprenantes ou atypiques, informations insolites, retrouvez tous les mois d...",
    image: conseilImage,
    date: "Mar 2019",
    href: "/articles/maisons-clous-chine",
  },
]

export default function ConseilPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get("q")?.toLowerCase().trim() ?? ""

  const [searchInput, setSearchInput] = useState(q)

  const filtered = q
    ? articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some(t => t.label.toLowerCase().includes(q))
      )
    : articles

  const handleSearch = () => {
    const trimmed = searchInput.trim()
    if (!trimmed) {
      router.push("/conseil-en-immobilier")
      return
    }
    router.push(`/conseil-en-immobilier?q=${encodeURIComponent(trimmed)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  const clearSearch = () => {
    setSearchInput("")
    router.push("/conseil-en-immobilier")
  }

  return (
    <main className="min-h-screen">
      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
      `}</style>

      <Header />

      {/* Hero Banner */}
      <section className="relative h-64 w-full overflow-hidden">
        <Image
          src={conseilImage}
          alt="Conseil en immobilier"
          fill
          className="object-cover"
          style={pulseStyle}
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl font-bold text-white drop-shadow-lg">
            Conseil en immobilier
          </h1>
        </div>
      </section>

      {/* Section principale */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="mb-5 font-serif text-2xl font-bold text-foreground">
              {"L'immobilier en Côte d'ivoire est un secteur complexe, en perpétuelle évolution."}
            </h2>
            <p className="mb-4 text-base leading-relaxed text-foreground">
              {"Pour mieux en appréhender tous les contours (notamment la réglementation en vigueur), obtenir des informations et des données fiables, connaître toutes les tendances et innovations du marché et saisir les meilleures opportunités d'investissement, il est indispensable d'être assisté d'experts du domaine."}
            </p>
            <p className="mb-6 text-base leading-relaxed text-foreground">
              {"Forts de notre longue expérience dans ce secteur et soucieux de répondre à toutes vos préoccupations en matière immobilière, un service juridique a été institué dès 2012 à l'Agence immobilière KEITA pour vous faire bénéficier de conseils pratiques et avisés et vous assister également dans vos démarches en collaboration étroite avec nos partenaires Auxiliaires de Justice."}
            </p>
            <p className="mb-5 text-base font-semibold text-foreground">
              Contactez nous pour en savoir plus.
            </p>
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Contactez-nous
              </Button>
            </Link>
          </div>
          <div className="relative h-72 w-full overflow-hidden rounded-md lg:h-96">
            <Image
              src={conseilImage}
              alt="Conseil immobilier"
              fill
              className="object-cover"
              style={pulseStyle}
            />
          </div>
        </div>
      </section>

      {/* Actualité Immobilière */}
      <section className="mx-auto max-w-6xl px-6 pb-16">

        {/* Header row: title + search */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Actualité Immobilière
          </h2>

          {/* Search bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 focus-within:border-primary transition-colors">
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher un article..."
                className="w-48 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
              />
              {searchInput && (
                <button onClick={clearSearch} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="rounded bg-primary px-3 py-1.5 text-white hover:bg-primary/90 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Active search indicator */}
        {q && (
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour{" "}
              <span className="font-semibold text-foreground">« {q} »</span>
            </span>
            <button
              onClick={clearSearch}
              className="flex items-center gap-1 rounded border border-gray-300 px-2 py-0.5 text-xs hover:bg-secondary transition-colors"
            >
              <X className="h-3 w-3" /> Effacer
            </button>
          </div>
        )}

        {/* No results */}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
            <p className="text-base text-muted-foreground">
              Aucun article trouvé pour{" "}
              <span className="font-semibold text-foreground">« {q} »</span>.
            </p>
            <button
              onClick={clearSearch}
              className="mt-4 rounded bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Voir tous les articles
            </button>
          </div>
        )}

        {/* Article grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((article, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-md border border-border bg-background transition-shadow hover:shadow-lg"
              >
                <Link href={article.href}>
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      style={pulseStyle}
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <Link
                        key={tag.label}
                        href={tag.href}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {tag.label}
                      </Link>
                    ))}
                  </div>

                  <Link href={article.href}>
                    <h3 className="mb-2 font-serif text-sm font-bold text-foreground hover:text-primary">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>

                  {article.date && (
                    <p className="mt-2 text-xs text-muted-foreground">{article.date}</p>
                  )}

                  <Link
                    href={article.href}
                    className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
                  >
                    Lire Plus ▶
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="mb-8 font-serif text-3xl font-bold text-foreground">
          Une autre question ?
        </h2>
        <Link href="/contact">
          <Button size="lg" className="bg-primary px-10 text-primary-foreground hover:bg-primary/90">
            Contactez-nous !
          </Button>
        </Link>
      </section>

      <Footer />
    </main>
  )
}