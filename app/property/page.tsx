"use client"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Camera, Plus, Search, ChevronRight, Loader2, X, ChevronLeft, BarChart2, Check } from "lucide-react"
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

export default function PropertyPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [favourites, setFavourites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try { const stored = localStorage.getItem("keita_favourites"); return new Set(stored ? JSON.parse(stored) : []) }
    catch { return new Set() }
  })
  const toggleFavourite = (id: string) => {
    setFavourites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem("keita_favourites", JSON.stringify([...next]))
      return next
    })
  }
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)
  const openLightbox = (images: string[], index = 0) => { if (images && images.length > 0) setLightbox({ images, index }) }
  const [compareList, setCompareList] = useState<Property[]>([])
  const toggleCompare = (property: Property) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === property.id)) return prev.filter(p => p.id !== property.id)
      if (prev.length >= 3) return prev
      return [...prev, property]
    })
  }
  const [filterType, setFilterType] = useState("")
  const [filterVille, setFilterVille] = useState("")
  const [filterBien, setFilterBien] = useState("")
  const [filterChambres, setFilterChambres] = useState("")
  const [filterBudget, setFilterBudget] = useState("")
  const [searchVille, setSearchVille] = useState("")
  const [searchType, setSearchType] = useState("")
  const [searchBien, setSearchBien] = useState("")
  const [searchChambres, setSearchChambres] = useState("")
  const [searchBudget, setSearchBudget] = useState("")
  const [credit, setCredit] = useState("")
  const [apport, setApport] = useState("")
  const [taux, setTaux] = useState("")
  const [duree, setDuree] = useState("")
  const [period, setPeriod] = useState("Mensuel")
  const [mensualite, setMensualite] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const handleRechercher = () => { setFilterType(searchType); setFilterVille(searchVille); setFilterBien(searchBien); setFilterChambres(searchChambres); setFilterBudget(searchBudget) }
  const calculer = () => {
    setError(null)
    const montant = parseFloat(credit.replace(/\s+/g, "")) - parseFloat((apport || "0").replace(/\s+/g, ""))
    const tauxAnnuel = parseFloat(taux.replace(/\s+/g, "")) / 100
    const annees = parseFloat(duree.replace(/\s+/g, ""))
    if (isNaN(montant) || isNaN(tauxAnnuel) || isNaN(annees)) { setError("Veuillez saisir des valeurs numeriques valides."); setMensualite(null); return }
    if (montant <= 0) { setError("Le montant du credit doit etre superieur a l apport."); setMensualite(null); return }
    let n: number, r: number
    if (period === "Mensuel") { n = annees * 12; r = tauxAnnuel / 12 } else { n = annees; r = tauxAnnuel }
    const payment = (montant * r) / (1 - Math.pow(1 + r, -n))
    if (!isFinite(payment)) { setError("Impossible de calculer avec ces parametres."); setMensualite(null); return }
    setMensualite(payment)
  }
  useEffect(() => {
    const q = query(collection(db, "properties"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snap) => { setProperties(snap.docs.map(d => ({ id: d.id, ...d.data() } as Property))); setLoading(false) }, (err) => { console.error("properties snapshot error", err); setProperties([]); setLoading(false) })
    return () => unsub()
  }, [])
  const filtered = properties.filter(p => {
    if (filterType && p.type !== filterType) return false
    if (filterVille && !p.ville?.toLowerCase().includes(filterVille.toLowerCase())) return false
    if (filterBien && p.category !== filterBien) return false
    if (filterChambres && p.chambres !== parseInt(filterChambres)) return false
    if (filterBudget) { const prix = parseFloat(p.price?.replace(/[^0-9]/g, "") || "0"); if (prix > parseFloat(filterBudget)) return false }
    return true
  })
  if (loading) return (<main className="min-h-screen"><Header /><div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div><Footer /></main>)
  return (
    <main className="min-h-screen">
      <Header />
      {lightbox && <Lightbox images={lightbox.images} startIndex={lightbox.index} onClose={() => setLightbox(null)} />}
      <CompareBar properties={compareList} onRemove={id => setCompareList(prev => prev.filter(p => p.id !== id))} onClear={() => setCompareList([])} />
      <div className="border-b border-border bg-background py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6">
          <div className="flex flex-1 items-center gap-2 rounded border border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Chercher une ville ou un code postal" className="flex-1 bg-transparent text-sm outline-none" value={searchVille} onChange={e => setSearchVille(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRechercher()} />
          </div>
          <select className="rounded border border-border px-3 py-2 text-sm" value={searchType} onChange={e => setSearchType(e.target.value)}>
            <option value="">Type operation</option>
            <option value="LOCATION">LOCATION</option>
            <option value="VENTE">VENTE</option>
          </select>
          <select className="rounded border border-border px-3 py-2 text-sm" value={searchBien} onChange={e => setSearchBien(e.target.value)}>
            <option value="">Type de bien</option>
            {Array.from(new Set(properties.map(p => p.category))).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select className="rounded border border-border px-3 py-2 text-sm" value={searchChambres} onChange={e => setSearchChambres(e.target.value)}>
            <option value="">Chambres</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <input placeholder="Surface Min" className="w-28 rounded border border-border px-3 py-2 text-sm outline-none" />
          <input placeholder="Budget Max (FCFA)" className="w-36 rounded border border-border px-3 py-2 text-sm outline-none" value={searchBudget} onChange={e => setSearchBudget(e.target.value)} type="number" />
          <Button onClick={handleRechercher} className="bg-primary text-white hover:bg-primary/90">Rechercher</Button>
          {(filterType || filterVille || filterBien || filterChambres || filterBudget) && (
            <button onClick={() => { setFilterType(""); setFilterVille(""); setFilterBien(""); setFilterChambres(""); setFilterBudget(""); setSearchType(""); setSearchVille(""); setSearchBien(""); setSearchChambres(""); setSearchBudget("") }} className="text-xs text-primary underline hover:text-primary/80">Reinitialiser</button>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-3 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">Accueil</Link>
        <span className="mx-2">›</span>
        <span>Proprietes</span>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Dernieres annonces</h3>
              <div className="space-y-3">
                {properties.slice(0, 4).map(p => (
                  <Link key={p.id} href={`/property/${p.id}`} className="flex gap-3 hover:opacity-80">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                      {p.images?.length > 0 ? <Image src={p.images[0]} alt={p.title} fill className="object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-muted-foreground">No img</div>}
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
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Exclusivites</h3>
              <div className="relative overflow-hidden rounded-md">
                <div className="absolute left-2 top-2 z-10 rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">EXCLUSIVITE</div>
                <div className="absolute right-2 top-2 z-10 rounded bg-foreground px-2 py-0.5 text-xs font-bold text-background">VENTE</div>
                <div className="absolute left-2 top-8 z-10 flex gap-1">
                  <button
                    onClick={() => toggleFavourite("exclusivite-1")}
                    className={`rounded p-1 transition-colors ${favourites.has("exclusivite-1") ? "bg-primary text-white" : "bg-white/80 text-foreground hover:bg-white"}`}
                  >
                    <Heart className={`h-3 w-3 ${favourites.has("exclusivite-1") ? "fill-white" : ""}`} />
                  </button>
                  <button
                    onClick={() => openLightbox(["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500"], 0)}
                    className="rounded bg-white/80 p-1 text-foreground hover:bg-white"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                  <button className="rounded bg-white/80 p-1 text-foreground hover:bg-white">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <Link href="/property" className="block hover:opacity-90 transition-opacity">
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500" alt="Exclusivite" fill className="object-cover" />
                  </div>
                  <div className="bg-foreground px-3 py-2 text-center">
                    <p className="text-sm font-bold text-background">264.000.000 FCFA</p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Calculez vos mensualites</h3>
              <div className="space-y-3">
                {[
                  { prefix: "FCFA", placeholder: "Montant du credit", val: credit, set: setCredit },
                  { prefix: "FCFA", placeholder: "Apport", val: apport, set: setApport },
                  { prefix: "%", placeholder: "Taux interet", val: taux, set: setTaux },
                  { prefix: "ans", placeholder: "Duree du pret (annees)", val: duree, set: setDuree },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 rounded border border-border px-3 py-2">
                    <span className="w-8 text-xs text-muted-foreground">{f.prefix}</span>
                    <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className="flex-1 bg-transparent text-sm outline-none" type="number" />
                  </div>
                ))}
                <select value={period} onChange={e => setPeriod(e.target.value)} className="w-full rounded border border-border px-3 py-2 text-sm">
                  <option>Mensuel</option>
                  <option>Annuel</option>
                </select>
                <Button onClick={calculer} className="w-full bg-foreground text-background hover:bg-foreground/80">Calculer</Button>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {mensualite !== null && !error && (
                  <div className="rounded bg-primary/10 px-4 py-3 text-center">
                    <p className="text-xs text-muted-foreground">Mensualite estimee</p>
                    <p className="text-lg font-bold text-primary">{mensualite.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} FCFA/mois</p>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Type</h3>
              <div className="space-y-1">
                {Array.from(new Set(properties.map(p => p.type))).map(type => {
                  const count = properties.filter(p => p.type === type).length
                  return (
                    <button key={type} onClick={() => setFilterType(filterType === type ? "" : type)} className={`flex w-full items-center gap-2 text-sm hover:text-primary ${filterType === type ? "font-bold text-primary" : "text-foreground"}`}>
                      <ChevronRight className="h-3 w-3 text-primary" />{type} <span className="text-muted-foreground">({count})</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Type de bien</h3>
              <div className="space-y-1">
                {Array.from(new Set(properties.map(p => p.category))).map(category => {
                  const count = properties.filter(p => p.category === category).length
                  return (
                    <button key={category} onClick={() => setFilterBien(filterBien === category ? "" : category)} className={`flex w-full items-center gap-2 text-sm hover:text-primary ${filterBien === category ? "font-bold text-primary" : "text-foreground"}`}>
                      <ChevronRight className="h-3 w-3 text-primary" />{category} <span className="text-muted-foreground">({count})</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Nos villes</h3>
              <div className="space-y-1">
                {Array.from(new Set(properties.map(p => p.ville))).map(ville => {
                  const count = properties.filter(p => p.ville === ville).length
                  return (
                    <button key={ville} onClick={() => setFilterVille(filterVille === ville ? "" : ville)} className={`flex w-full items-center gap-2 text-sm hover:text-primary ${filterVille === ville ? "font-bold text-primary" : "text-foreground"}`}>
                      <ChevronRight className="h-3 w-3 text-primary" />{ville} <span className="text-muted-foreground">({count})</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h1 className="mb-6 font-serif text-2xl font-bold text-foreground">Proprietes ({filtered.length})</h1>
            {(filterType || filterVille || filterBien || filterChambres || filterBudget) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {filterType && <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Type: {filterType} <button onClick={() => setFilterType("")}>x</button></span>}
                {filterVille && <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Ville: {filterVille} <button onClick={() => setFilterVille("")}>x</button></span>}
                {filterBien && <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Bien: {filterBien} <button onClick={() => setFilterBien("")}>x</button></span>}
                {filterChambres && <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{filterChambres} chambre(s) <button onClick={() => setFilterChambres("")}>x</button></span>}
                {filterBudget && <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Budget max: {filterBudget} <button onClick={() => setFilterBudget("")}>x</button></span>}
              </div>
            )}
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">Aucune propriete trouvee avec ces criteres.</div>
              ) : (
                filtered.map(p => {
                  const isFav = favourites.has(p.id)
                  const isCompared = compareList.some(c => c.id === p.id)
                  const canAddCompare = compareList.length < 3 || isCompared
                  return (
                    <div key={p.id} className="flex gap-4 overflow-hidden rounded-md border border-border bg-background">
                      <div className="relative h-auto w-48 flex-shrink-0 overflow-hidden">
                        {p.images?.length > 0 ? <Image src={p.images[0]} alt={p.title} fill className="object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">No image</div>}
                        <div className="absolute left-2 top-2 flex gap-1">
                          <button title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"} onClick={() => toggleFavourite(p.id)} className={`rounded p-1 transition-colors ${isFav ? "bg-primary text-white" : "bg-white/80 text-foreground hover:bg-white"}`}>
                            <Heart className={`h-3 w-3 ${isFav ? "fill-white" : ""}`} />
                          </button>
                          <button title={`Voir les photos`} onClick={() => openLightbox(p.images ?? [], 0)} disabled={!p.images?.length} className="rounded bg-white/80 p-1 text-foreground hover:bg-white disabled:opacity-40">
                            <Camera className="h-3 w-3" />
                          </button>
                          <button title={isCompared ? "Retirer de la comparaison" : compareList.length >= 3 ? "Maximum 3 biens" : "Ajouter a la comparaison"} onClick={() => canAddCompare && toggleCompare(p)} className={`rounded p-1 transition-colors ${isCompared ? "bg-primary text-white" : "bg-white/80 text-foreground hover:bg-white"} ${!canAddCompare ? "cursor-not-allowed opacity-40" : ""}`}>
                            {isCompared ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                          </button>
                        </div>
                        {p.images?.length > 1 && (
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                            <Camera className="h-2.5 w-2.5" />{p.images.length}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 items-start justify-between p-4">
                        <div className="flex-1">
                          <span className={`mb-2 inline-block rounded px-2 py-0.5 text-xs font-bold text-white ${p.type === "VENTE" ? "bg-foreground" : "bg-primary"}`}>{p.type}</span>
                          <h3 className="mb-2 font-serif text-base font-bold text-foreground">{p.title}</h3>
                          {p.chambres && <p className="text-sm text-muted-foreground">Chambres: {p.chambres}</p>}
                          {p.salles && <p className="text-sm text-muted-foreground">Salle(s) de bain(s): {p.salles}</p>}
                          <p className="text-sm text-muted-foreground">{p.category}</p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Keita Immobilier</span>
                            <span>REF: {p.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <p className="font-bold text-foreground whitespace-nowrap">{p.price}</p>
                          <Link href={`/property/${p.id}`}>
                            <Button className="bg-primary text-white hover:bg-primary/90">Details <ChevronRight className="ml-1 h-4 w-4" /></Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="rounded border border-border px-3 py-1 text-sm hover:bg-secondary">&#8249;</button>
              {[1, 2, 3].map(n => (<button key={n} className={`rounded px-3 py-1 text-sm ${n === 1 ? "bg-primary text-white" : "border border-border hover:bg-secondary"}`}>{n}</button>))}
              <button className="rounded border border-border px-3 py-1 text-sm hover:bg-secondary">&#8250;</button>
              <button className="rounded border border-border px-3 py-1 text-sm hover:bg-secondary">&#187;</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
