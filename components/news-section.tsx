"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const newsArticles = [
  {
    image: "/images/syndic-hero.jpg",
    tags: [
      { label: "Définition du mois", href: "/articles/syndic-copropriete" },
      { label: "Lexique immobilier", href: "/articles/syndic-copropriete" },
    ],
    title: "Le SYNDIC de Copropriété",
    excerpt: "Le SYNDIC de Copropriété est une personne physique ou morale désignée par l'ensemble des coproprietaires pour gerer les parties communes d'un immeuble...",
    date: "Oct 2020",
    href: "/articles/syndic-copropriete",
  },
  {
    image: "/images/vente-couple.svg",
    tags: [
      { label: "Immobilier", href: "/articles/5-astuces-deco" },
      { label: "Décoration", href: "/decoration" },
    ],
    title: "5 Astuces déco pour relooker votre salon sans vous ruiner",
    excerpt: "La déco de votre salon vous déprime ? Vous avez des envies de changements ? Le salon est la pièce maîtresse de votre intérieur...",
    date: "Oct 2020",
    href: "/articles/5-astuces-deco",
  },
  {
    image: "/images/gestion-hero.jpg",
    tags: [
      { label: "KEITA Centre d'Affaires", href: "/keita-centre-affaires" },
      { label: "Centre d'Affaires", href: "/keita-centre-affaires" },
      { label: "Domiciliation", href: "/keita-centre-affaires" },
    ],
    title: "Découvrez le Centre d'Affaires de KEITA",
    excerpt: "Ouvert depuis 2015 pour répondre aux besoins spécifiques de la clientèle professionnelle à Abidjan, le KCA propose des espaces modernes et équipés...",
    date: "Oct 2019",
    href: "/keita-centre-affaires",
  },
  {
    image: "/images/conseil-hero.jpg",
    tags: [
      { label: "Le Saviez-Vous ?", href: "/articles/maisons-clous-chine" },
    ],
    title: 'Les « Maisons Clous » en Chine',
    excerpt: "Découvertes surprenantes ou atypiques, informations insolites, retrouvez tous les mois des perles de l'immobilier à travers le monde...",
    date: "Mar 2019",
    href: "/articles/maisons-clous-chine",
  },
]

export function NewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section id="actualites" className="bg-secondary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold text-foreground lg:text-4xl">
            {"L'actualité immobilière"}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Précédent</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Suivant</span>
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {newsArticles.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="group min-w-[300px] max-w-[320px] flex-shrink-0 overflow-hidden rounded-md bg-background shadow-md transition-shadow hover:shadow-xl"
            >
              <article>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/20 transition-opacity group-hover:bg-foreground/10" />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <Badge
                        key={tag.label}
                        variant="secondary"
                        className="bg-accent/15 text-xs text-accent cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          window.location.href = tag.href
                        }}
                      >
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="mb-2 font-serif text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                    <span className="text-xs font-semibold text-primary group-hover:underline">
                      Lire Plus
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}