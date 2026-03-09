import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import conseilImage from "@/app/assets/conseil.jpg"

export const metadata: Metadata = {
  title: "Conseil en Immobilier - Keita Immobilier",
  description: "Bénéficiez de conseils pratiques et avisés en immobilier avec KEITA.",
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
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-64 w-full overflow-hidden">
        <Image
          src={conseilImage}
          alt="Conseil en immobilier"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl font-bold text-white drop-shadow-lg">
            Conseil en immobilier
          </h1>
        </div>
      </section>

      {/* Section principale : texte gauche, image droite */}
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
            />
          </div>
        </div>
      </section>

      {/* Actualité Immobilière */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Actualité Immobilière
          </h2>
          <div className="flex gap-2">
           <button suppressHydrationWarning className="rounded border border-border px-3 py-1 text-sm text-foreground hover:bg-secondary">Préc</button>
           <button suppressHydrationWarning className="rounded border border-border px-3 py-1 text-sm text-foreground hover:bg-secondary">Suiv</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-md border border-border bg-background transition-shadow hover:shadow-lg"
            >
              {/* Image cliquable */}
              <Link href={article.href}>
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
              </Link>

              <div className="p-4">
                {/* Tags — liens rouges cliquables */}
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

                {/* Titre cliquable */}
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

                {/* Lire Plus — lien rouge cliquable */}
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