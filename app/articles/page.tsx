"use client"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Suspense } from "react"

const allArticles = [
  {
    title: "Le SYNDIC de Copropriété",
    tags: ["Définition du mois", "lexique immobilier"],
    excerpt: "Le SYNDIC de Copropriété est une personne physique ou morale désignée par l'ensemble des...",
    image: "/images/syndic-hero.svg",
    date: "Oct 2020",
    href: "/articles/syndic-copropriete",
    tagKeys: ["definition", "immobilier"],
  },
  {
    title: "5 Astuces déco pour relooker votre salon sans vous ruiner",
    tags: ["immobilier", "Décoration"],
    excerpt: "La déco de votre salon vous déprime ? Vous avez des envies de changements ? Le salon est...",
    image: "/images/vente-couple.svg",
    date: "",
    href: "/articles/5-astuces-deco",
    tagKeys: ["immobilier", "decoration"],
  },
  {
    title: "Découvrez le Centre d'Affaires de Keita",
    tags: ["Keita Centre d'Affaires", "Centre d'Affaires", "Domiciliation"],
    excerpt: "Ouvert depuis 2015 pour répondre aux besoins spécifiques de la clientèle...",
    image: "/images/gestion-hero.svg",
    date: "",
    href: "/articles/centre-affaires-kalimba",
    tagKeys: ["centre-affaires", "domiciliation"],
  },
  {
    title: 'Les « Maisons Clous » en Chine',
    tags: ["Le Saviez-Vous ?"],
    excerpt: "Découvertes surprenantes ou atypiques, informations insolites, retrouvez tous les mois d...",
    image: "/images/conseil-hero.svg",
    date: "Mar 2019",
    href: "/articles/maisons-clous-chine",
    tagKeys: ["saviez-vous"],
  },
]

function ArticlesList() {
  const searchParams = useSearchParams()
  const tag = searchParams.get("tag")

  const filtered = tag
    ? allArticles.filter((a) => a.tagKeys.includes(tag))
    : allArticles

  return (
    <main className="min-h-screen">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {tag ? `Articles : ${tag}` : "Actualité Immobilière"}
          </h1>
          {tag && (
            <Link
              href="/articles"
              className="text-sm font-medium text-primary hover:underline"
            >
              ← Voir tous les articles
            </Link>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground">Aucun article trouvé pour ce tag.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((article, i) => (
            <Link key={i} href={article.href}>
              <div
                className="overflow-hidden rounded-md border border-border bg-background transition-shadow hover:shadow-lg cursor-pointer h-full"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {article.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mb-2 font-serif text-sm font-bold text-foreground hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>
                  {article.date && (
                    <p className="mt-2 text-xs text-muted-foreground">{article.date}</p>
                  )}
                  <span
                    className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
                  >
                    Lire Plus ▶
                  </span>
                </div>
              </div>
            </Link>
          ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Chargement...</div>}>
      <ArticlesList />
    </Suspense>
  )
}
