"use client"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore"
import { Heart, Camera, Plus, Check, X, ChevronLeft, ChevronRight, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Property {
  id: string
  title: string
  price: string
  chambres: number
  salles: number
  category: string
  images: string[]
}

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

function CompareBar({ properties, onRemove, onClear }: { properties: Property[]; onRemove: (id: string) => void; onClear: () => void }) {
  if (properties.length === 0) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <BarChart2 className="h-5 w-5 flex-shrink-0 text-primary" />
        <span className="text-sm font-semibold text-foreground">Comparer ({properties.length}/3)</span>
        <div className="flex flex-1 gap-3">
          {properties.map(p => (
            <div key={p.id} className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5">
              <span className="max-w-[120px] truncate text-xs font-medium text-foreground">{p.title}</span>
              <button onClick={() => onRemove(p.id)} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
            </div>
          ))}
          {Array.from({ length: 3 - properties.length }).map((_, i) => (
            <div key={i} className="flex items-center rounded-md border border-dashed border-border px-3 py-1.5">
              <span className="text-xs text-muted-foreground">Ajouter un bien</span>
            </div>
          ))}
        </div>
        {properties.length >= 2 && <Button size="sm" className="bg-primary text-white hover:bg-primary/90">Comparer</Button>}
        <button onClick={onClear} className="text-xs text-muted-foreground underline hover:text-foreground">Effacer</button>
      </div>
    </div>
  )
}

export function RecentListings() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

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
  const openLightbox = (e: React.MouseEvent, images: string[], index = 0) => {
    e.preventDefault()
    if (images && images.length > 0) setLightbox({ images, index })
  }

  const [compareList, setCompareList] = useState<Property[]>([])
  const toggleCompare = (e: React.MouseEvent, property: Property) => {
    e.preventDefault()
    setCompareList(prev => {
      if (prev.find(p => p.id === property.id)) return prev.filter(p => p.id !== property.id)
      if (prev.length >= 3) return prev
      return [...prev, property]
    })
  }

  useEffect(() => {
    const q = query(collection(db, "properties"), orderBy("createdAt", "desc"), limit(4))
    const unsub = onSnapshot(q, snap => {
      const props = snap.docs.map(d => ({ id: d.id, ...d.data() } as Property))
      setProperties(props)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return (
    <section className="py-16 bg-background">
      {lightbox && <Lightbox images={lightbox.images} startIndex={lightbox.index} onClose={() => setLightbox(null)} />}
      <CompareBar properties={compareList} onRemove={id => setCompareList(prev => prev.filter(p => p.id !== id))} onClear={() => setCompareList([])} />

      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-12">Dernières annonces</h2>

        <div className="space-y-6">
          {properties.map(p => {
            const isFav = favourites.has(p.id)
            const isCompared = compareList.some(c => c.id === p.id)
            const canAddCompare = compareList.length < 3 || isCompared
            return (
              <Link key={p.id} href={`/property/${p.id}`} className="flex gap-4 overflow-hidden rounded-md border border-border bg-white hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative h-auto w-48 flex-shrink-0 overflow-hidden">
                  {p.images && p.images.length > 0 ? (
                    <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">No image</div>
                  )}

                  {/* Action buttons */}
                  <div className="absolute left-2 top-2 flex gap-1">
                    <button
                      title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                      onClick={e => toggleFavourite(e, p.id)}
                      className={`rounded p-1 transition-colors ${isFav ? "bg-primary text-white" : "bg-white/80 text-foreground hover:bg-white"}`}
                    >
                      <Heart className={`h-3 w-3 ${isFav ? "fill-white" : ""}`} />
                    </button>
                    <button
                      title="Voir les photos"
                      onClick={e => openLightbox(e, p.images ?? [], 0)}
                      disabled={!p.images?.length}
                      className="rounded bg-white/80 p-1 text-foreground hover:bg-white disabled:opacity-40"
                    >
                      <Camera className="h-3 w-3" />
                    </button>
                    <button
                      title={isCompared ? "Retirer de la comparaison" : compareList.length >= 3 ? "Maximum 3 biens" : "Ajouter a la comparaison"}
                      onClick={e => canAddCompare ? toggleCompare(e, p) : e.preventDefault()}
                      className={`rounded p-1 transition-colors ${isCompared ? "bg-primary text-white" : "bg-white/80 text-foreground hover:bg-white"} ${!canAddCompare ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      {isCompared ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    </button>
                  </div>

                  {/* Photo count badge */}
                  {p.images?.length > 1 && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                      <Camera className="h-2.5 w-2.5" />{p.images.length}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2">{p.title}</h3>
                    <p className="text-2xl font-bold text-primary mb-3">{p.price}</p>
                    <p className="text-sm text-muted-foreground">
                      {p.chambres} Ch • {p.salles} Salle(s) de bain(s) • {p.category}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {properties.length === 0 && !loading && (
          <div className="text-center text-muted-foreground py-12">Aucune annonce pour le moment</div>
        )}
      </div>
    </section>
  )
}