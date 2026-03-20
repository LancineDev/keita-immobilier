"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart, Camera, Plus, Check, X, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRef } from "react"

const newsArticles = [
  {
    id: "syndic-copropriete",
    image: "/images/syndic-hero.jpeg",
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
    id: "5-astuces-deco",
    image: "/images/vente-couple.jpg",
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
    id: "keita-centre-affaires",
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
    id: "maisons-clous-chine",
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

type Article = typeof newsArticles[0]

function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex)
  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, prev, next])
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" onClick={onClose}>
      <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X className="h-5 w-5" /></button>
      <button onClick={e => { e.stopPropagation(); prev() }} className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><ChevronLeft className="h-6 w-6" /></button>
      <div className="relative h-[80vh] w-[90vw] max-w-4xl" onClick={e => e.stopPropagation()}>
        <Image src={images[current]} alt={`Photo ${current + 1}`} fill className="object-contain" />
      </div>
      <button onClick={e => { e.stopPropagation(); next() }} className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><ChevronRight className="h-6 w-6" /></button>
      <div className="absolute bottom-4 text-sm text-white/70">{current + 1} / {images.length}</div>
    </div>
  )
}

function CompareBar({ articles, onRemove, onClear }: { articles: Article[]; onRemove: (id: string) => void; onClear: () => void }) {
  if (articles.length === 0) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <BarChart2 className="h-5 w-5 flex-shrink-0 text-primary" />
        <span className="text-sm font-semibold text-foreground">Comparer ({articles.length}/3)</span>
        <div className="flex flex-1 gap-3">
          {articles.map(a => (
            <div key={a.id} className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5">
              <span className="max-w-[120px] truncate text-xs font-medium text-foreground">{a.title}</span>
              <button onClick={() => onRemove(a.id)} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
            </div>
          ))}
          {Array.from({ length: 3 - articles.length }).map((_, i) => (
            <div key={i} className="flex items-center rounded-md border border-dashed border-border px-3 py-1.5">
              <span className="text-xs text-muted-foreground">Ajouter un article</span>
            </div>
          ))}
        </div>
        {articles.length >= 2 && <Button size="sm" className="bg-primary text-white hover:bg-primary/90">Comparer</Button>}
        <button onClick={onClear} className="text-xs text-muted-foreground underline hover:text-foreground">Effacer</button>
      </div>
    </div>
  )
}

export function NewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const [favourites, setFavourites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try { const stored = localStorage.getItem("keita_favourites"); return new Set(stored ? JSON.parse(stored) : []) }
    catch { return new Set() }
  })
  const toggleFavourite = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setFavourites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem("keita_favourites", JSON.stringify([...next]))
      return next
    })
  }

  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)
  const openLightbox = (e: React.MouseEvent, image: string) => {
    e.preventDefault()
    setLightbox({ images: [image], index: 0 })
  }

  const [compareList, setCompareList] = useState<Article[]>([])
  const toggleCompare = (e: React.MouseEvent, article: Article) => {
    e.preventDefault()
    setCompareList(prev => {
      if (prev.find(a => a.id === article.id)) return prev.filter(a => a.id !== article.id)
      if (prev.length >= 3) return prev
      return [...prev, article]
    })
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -350 : 350, behavior: "smooth" })
    }
  }

  return (
    <section id="actualites" className="bg-secondary py-16 lg:py-24">
      {lightbox && <Lightbox images={lightbox.images} startIndex={lightbox.index} onClose={() => setLightbox(null)} />}
      <CompareBar articles={compareList} onRemove={id => setCompareList(prev => prev.filter(a => a.id !== id))} onClear={() => setCompareList([])} />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold text-foreground lg:text-4xl">
            {"L'actualité immobilière"}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => scroll("left")}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => scroll("right")}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {newsArticles.map((article) => {
            const isFav = favourites.has(article.id)
            const isCompared = compareList.some(a => a.id === article.id)
            const canAddCompare = compareList.length < 3 || isCompared
            return (
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

                    {/* Action buttons */}
                    <div className="absolute left-2 top-2 flex gap-1">
                      <button
                        title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                        onClick={e => toggleFavourite(e, article.id)}
                        className={`rounded p-1 transition-colors ${isFav ? "bg-primary text-white" : "bg-white/80 text-foreground hover:bg-white"}`}
                      >
                        <Heart className={`h-3 w-3 ${isFav ? "fill-white" : ""}`} />
                      </button>
                      <button
                        title="Voir l'image"
                        onClick={e => openLightbox(e, article.image)}
                        className="rounded bg-white/80 p-1 text-foreground hover:bg-white"
                      >
                        <Camera className="h-3 w-3" />
                      </button>
                      <button
                        title={isCompared ? "Retirer de la comparaison" : compareList.length >= 3 ? "Maximum 3 articles" : "Ajouter a la comparaison"}
                        onClick={e => canAddCompare ? toggleCompare(e, article) : e.preventDefault()}
                        className={`rounded p-1 transition-colors ${isCompared ? "bg-primary text-white" : "bg-white/80 text-foreground hover:bg-white"} ${!canAddCompare ? "cursor-not-allowed opacity-40" : ""}`}
                      >
                        {isCompared ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {article.tags.map((tag) => (
                        <Badge
                          key={tag.label}
                          variant="secondary"
                          className="bg-accent/15 text-xs text-accent cursor-pointer"
                          onClick={(e) => { e.preventDefault(); window.location.href = tag.href }}
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
                      <span className="text-xs font-semibold text-primary group-hover:underline">Lire Plus</span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}