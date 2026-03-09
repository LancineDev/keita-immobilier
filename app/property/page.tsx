"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Camera, Plus, Search, ChevronRight, Loader2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"

type Property = {
  id: string
  title: string
  type: "LOCATION" | "VENTE"
  price: string
  ville: string
  quartier: string
  pays: string
  chambres: number
  salles: number
  category: string
  description: string
  features: string
  images: string[]
  loyer?: string
}

export default function PropertyPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterVille, setFilterVille] = useState<string | null>(null)
  const [filterBien, setFilterBien] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, "properties"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      setProperties(snap.docs.map(d => ({ id: d.id, ...d.data() } as Property)))
      setLoading(false)
    }, (err) => {
      console.error("properties snapshot error", err)
      setProperties([])
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const filtered = properties.filter(p => {
    if (filterType && p.type !== filterType) return false
    if (filterVille && p.ville !== filterVille) return false
    if (filterBien && p.category !== filterBien) return false
    return true
  })

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Barre de recherche */}
      <div className="border-b border-border bg-background py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6">
          <div className="flex flex-1 items-center gap-2 rounded border border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Chercher une ville ou un code postal" className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <select className="rounded border border-border px-3 py-2 text-sm">
            <option>{"Type d'opération"}</option>
            <option>LOCATION</option>
            <option>VENTE</option>
          </select>
          <select className="rounded border border-border px-3 py-2 text-sm">
            <option>Type de bien</option>
            {Array.from(new Set(properties.map(p => p.category))).map(cat => 
              <option key={cat}>{cat}</option>
            )}
          </select>
          <select className="rounded border border-border px-3 py-2 text-sm">
            <option>Chambres</option>
            {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
          </select>
          <input placeholder="Surface Min" className="w-28 rounded border border-border px-3 py-2 text-sm" />
          <input placeholder="Budget Max (FCFA)" className="w-36 rounded border border-border px-3 py-2 text-sm" />
          <Button className="bg-primary text-white hover:bg-primary/90">Rechercher</Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 py-3 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">Accueil</Link>
        <span className="mx-2">›</span>
        <span>Propriétés</span>
      </div>

      {/* Layout 2 colonnes */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Sidebar gauche */}
          <div className="space-y-6 lg:col-span-1">

            {/* Dernières annonces */}
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Dernières annonces</h3>
              <div className="space-y-3">
                {properties.slice(0, 4).map(p => (
                  <Link key={p.id} href={`/property/${p.id}`} className="flex gap-3 hover:opacity-80">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                      {p.images && p.images.length > 0 ? (
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-tight">{p.title}</p>
                      <p className="text-sm font-bold text-primary">{p.price}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Exclusivités */}
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Exclusivités</h3>
              <div className="relative overflow-hidden rounded-md">
                <div className="absolute left-2 top-2 z-10 rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">EXCLUSIVITÉ</div>
                <div className="absolute right-2 top-2 z-10 rounded bg-foreground px-2 py-0.5 text-xs font-bold text-background">VENTE</div>
                <div className="relative h-40 w-full">
                  <Image src="/images/vente-couple.jpg" alt="Exclusivité" fill className="object-cover" />
                </div>
                <div className="bg-foreground px-3 py-2 text-center">
                  <p className="text-sm font-bold text-background">264.000.000 FCFA</p>
                </div>
              </div>
            </div>

            {/* Calculez vos mensualités */}
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Calculez vos mensualités</h3>
              <div className="space-y-3">
                {[
                  { prefix: "FCFA", placeholder: "Montant du crédit" },
                  { prefix: "FCFA", placeholder: "Apport" },
                  { prefix: "%", placeholder: "Taux d'intérêt" },
                  { prefix: "📅", placeholder: "Durée du prêt (années)" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 rounded border border-border px-3 py-2">
                    <span className="text-xs text-muted-foreground">{f.prefix}</span>
                    <input placeholder={f.placeholder} className="flex-1 bg-transparent text-sm outline-none" />
                  </div>
                ))}
                <select className="w-full rounded border border-border px-3 py-2 text-sm">
                  <option>Mensuel</option>
                  <option>Annuel</option>
                </select>
                <Button className="w-full bg-foreground text-background hover:bg-foreground/80">Calculer</Button>
              </div>
            </div>

            {/* Type */}
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Type</h3>
              <div className="space-y-1">
                {Array.from(new Set(properties.map(p => p.type))).map(type => {
                  const count = properties.filter(p => p.type === type).length
                  return (
                    <button
                      key={type}
                      onClick={() => setFilterType(filterType === type ? null : type)}
                      className={`flex w-full items-center gap-2 text-sm hover:text-primary ${filterType === type ? "font-bold text-primary" : "text-foreground"}`}
                    >
                      <ChevronRight className="h-3 w-3 text-primary" />
                      {type} <span className="text-muted-foreground">({count})</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Type de bien */}
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Type de bien</h3>
              <div className="space-y-1">
                {Array.from(new Set(properties.map(p => p.category))).map(category => {
                  const count = properties.filter(p => p.category === category).length
                  return (
                    <button
                      key={category}
                      onClick={() => setFilterBien(filterBien === category ? null : category)}
                      className={`flex w-full items-center gap-2 text-sm hover:text-primary ${filterBien === category ? "font-bold text-primary" : "text-foreground"}`}
                    >
                      <ChevronRight className="h-3 w-3 text-primary" />
                      {category} <span className="text-muted-foreground">({count})</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Nos villes */}
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Nos villes</h3>
              <div className="space-y-1">
                {Array.from(new Set(properties.map(p => p.ville))).map(ville => {
                  const count = properties.filter(p => p.ville === ville).length
                  return (
                    <button
                      key={ville}
                      onClick={() => setFilterVille(filterVille === ville ? null : ville)}
                      className={`flex w-full items-center gap-2 text-sm hover:text-primary ${filterVille === ville ? "font-bold text-primary" : "text-foreground"}`}
                    >
                      <ChevronRight className="h-3 w-3 text-primary" />
                      {ville} <span className="text-muted-foreground">({count})</span>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Liste des propriétés */}
          <div className="lg:col-span-2">
            <h1 className="mb-6 font-serif text-2xl font-bold text-foreground">
              Propriétés {filtered.length > 0 && `(${filtered.length})`}
            </h1>

            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  Aucune propriété trouvée avec ces critères.
                </div>
              ) : (
                filtered.map(p => (
                  <div key={p.id} className="flex gap-4 overflow-hidden rounded-md border border-border bg-background">
                    {/* Image */}
                    <div className="relative h-auto w-48 flex-shrink-0 overflow-hidden">
                      {p.images && p.images.length > 0 ? (
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
                          No image
                        </div>
                      )}
                      <div className="absolute left-2 top-2 flex gap-1">
                        <button className="rounded bg-white/80 p-1 hover:bg-white"><Heart className="h-3 w-3 text-foreground" /></button>
                        <button className="rounded bg-white/80 p-1 hover:bg-white"><Camera className="h-3 w-3 text-foreground" /></button>
                        <button className="rounded bg-white/80 p-1 hover:bg-white"><Plus className="h-3 w-3 text-foreground" /></button>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-1 items-start justify-between p-4">
                      <div className="flex-1">
                        <span className={`mb-2 inline-block rounded px-2 py-0.5 text-xs font-bold text-white ${p.type === "VENTE" ? "bg-foreground" : "bg-primary"}`}>
                          {p.type}
                        </span>
                        <h3 className="mb-2 font-serif text-base font-bold text-foreground">{p.title}</h3>
                        {p.chambres && <p className="text-sm text-muted-foreground">Chambres: {p.chambres}</p>}
                        {p.salles && <p className="text-sm text-muted-foreground">{"Salle(s) de bain(s):"} {p.salles}</p>}
                        <p className="text-sm text-muted-foreground">{p.category}</p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>🏢 Keita Immobilier</span>
                          <span>⚙️ RÉF: {p.id.slice(0, 8)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <p className="font-bold text-foreground whitespace-nowrap">{p.price}</p>
                        <Link href={`/property/${p.id}`}>
                          <Button className="bg-primary text-white hover:bg-primary/90">
                            Détails <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="rounded border border-border px-3 py-1 text-sm hover:bg-secondary">‹</button>
              {[1, 2, 3].map(n => (
                <button key={n} className={`rounded px-3 py-1 text-sm ${n === 1 ? "bg-primary text-white" : "border border-border hover:bg-secondary"}`}>
                  {n}
                </button>
              ))}
              <button className="rounded border border-border px-3 py-1 text-sm hover:bg-secondary">›</button>
              <button className="rounded border border-border px-3 py-1 text-sm hover:bg-secondary">»</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}