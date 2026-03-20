"use client"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { doc, getDoc, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, ChevronRight, ChevronLeft, Search, Heart, Share2, Loader2, Camera, Plus, Check, X, BarChart2 } from "lucide-react"

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

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentImage, setCurrentImage] = useState(0)
  const [recentProperties, setRecentProperties] = useState<Property[]>([])

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

  const [compareList, setCompareList] = useState<Property[]>([])
  const toggleCompare = (property: Property) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === property.id)) return prev.filter(p => p.id !== property.id)
      if (prev.length >= 3) return prev
      return [...prev, property]
    })
  }

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return
      setLoading(true)
      try {
        const docSnap = await getDoc(doc(db, "properties", id))
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() } as Property)
        } else {
          setError("Propriete non trouvee")
        }
      } catch (e) {
        console.error(e)
        setError("Erreur lors du chargement")
      }
      setLoading(false)
    }
    fetchProperty()
  }, [id])

  useEffect(() => {
    const q = query(collection(db, "properties"), orderBy("createdAt", "desc"), limit(5))
    const unsub = onSnapshot(q, snapshot => {
      const props: Property[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Property))
      setRecentProperties(props.filter(p => p.id !== id))
    })
    return () => unsub()
  }, [id])

  if (loading) {
    return (<main className="min-h-screen"><Header /><div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div><Footer /></main>)
  }
  if (error || !property) {
    return (<main className="min-h-screen"><Header /><div className="flex min-h-[50vh] items-center justify-center"><p className="text-red-500">{error || "Propriete non trouvee"}</p></div><Footer /></main>)
  }

  const images = property.images || []
  const isFav = favourites.has(property.id)
  const isCompared = compareList.some(c => c.id === property.id)
  const canAddCompare = compareList.length < 3 || isCompared

  return (
    <main className="min-h-screen">
      <Header />

      {lightbox && <Lightbox images={lightbox.images} startIndex={lightbox.index} onClose={() => setLightbox(null)} />}
      <CompareBar properties={compareList} onRemove={id => setCompareList(prev => prev.filter(p => p.id !== id))} onClear={() => setCompareList([])} />

      <div className="border-b border-border bg-background py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6">
          <div className="flex flex-1 items-center gap-2 rounded border border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Chercher une ville ou un code postal" className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <select className="rounded border border-border px-3 py-2 text-sm">
            <option>Type operation</option>
            <option>LOCATION</option>
            <option>VENTE</option>
          </select>
          <select className="rounded border border-border px-3 py-2 text-sm">
            <option>Type de bien</option>
          </select>
          <Button className="bg-primary text-white hover:bg-primary/90">Rechercher</Button>
        </div>
      </div>

      <section className="relative h-[500px] w-full overflow-hidden bg-black">
        {images.length > 0 && (
          <Image src={images[currentImage]} alt={property.title} fill className="object-cover opacity-90" priority />
        )}
        {images.length > 1 && (
          <>
            <button onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/80"><ChevronLeft className="h-6 w-6" /></button>
            <button onClick={() => setCurrentImage(prev => prev < images.length - 1 ? prev + 1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/80"><ChevronRight className="h-6 w-6" /></button>
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-8 py-8">
          <h1 className="font-serif text-2xl font-bold text-white">{property.title}</h1>
          <p className="mt-1 text-xl font-bold text-white">{property.price}</p>
          <Link href="/contact"><Button className="mt-4 bg-primary text-white hover:bg-primary/90">Contacter agence</Button></Link>
        </div>

        {/* Top right action buttons */}
        <div className="absolute right-4 top-4 flex gap-2">
          <button className="rounded-full bg-black/50 p-2 text-white hover:bg-black/80" title="Partager">
            <Share2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => toggleFavourite(property.id)}
            title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={`rounded-full p-2 transition-colors ${isFav ? "bg-primary text-white" : "bg-black/50 text-white hover:bg-black/80"}`}
          >
            <Heart className={`h-5 w-5 ${isFav ? "fill-white" : ""}`} />
          </button>
          <button
            onClick={() => images.length > 0 && setLightbox({ images, index: currentImage })}
            title={`Voir toutes les photos (${images.length})`}
            disabled={images.length === 0}
            className="rounded-full bg-black/50 p-2 text-white hover:bg-black/80 disabled:opacity-40"
          >
            <Camera className="h-5 w-5" />
          </button>
          <button
            onClick={() => canAddCompare && toggleCompare(property)}
            title={isCompared ? "Retirer de la comparaison" : compareList.length >= 3 ? "Maximum 3 biens" : "Ajouter a la comparaison"}
            className={`rounded-full p-2 transition-colors ${isCompared ? "bg-primary text-white" : "bg-black/50 text-white hover:bg-black/80"} ${!canAddCompare ? "cursor-not-allowed opacity-40" : ""}`}
          >
            {isCompared ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-20 right-4 flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-xs text-white">
            <Camera className="h-3 w-3" />{currentImage + 1} / {images.length}
          </div>
        )}

        <div className="absolute left-4 top-4">
          <span className={`rounded px-3 py-1 text-sm font-bold text-white ${property.type === "VENTE" ? "bg-foreground" : "bg-primary"}`}>{property.type}</span>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-3 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">Accueil</Link>
        <span className="mx-2">›</span>
        <Link href="/property" className="text-primary hover:underline">Proprietes</Link>
        <span className="mx-2">›</span>
        <span>{property.title}</span>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-md border border-border p-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Lieu : {property.ville}</span>
              </div>
            </div>
            <div className="rounded-md border border-border p-6">
              <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Description</h2>
              <div className="h-px bg-border mb-4" />
              <p className="text-base leading-relaxed text-foreground">{property.description}</p>
            </div>
            <div className="rounded-md border border-border p-6">
              <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Localisation :</h2>
              <div className="h-px bg-border mb-4" />
              <div className="overflow-hidden rounded-md border border-border">
                <div className="grid grid-cols-3 divide-x divide-border bg-muted/30">
                  <div className="p-4"><p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Ville:</p><p className="text-sm font-medium text-foreground">{property.ville}</p></div>
                  <div className="p-4"><p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Quartier :</p><p className="text-sm font-medium text-foreground">{property.quartier}</p></div>
                  <div className="p-4"><p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Pays:</p><p className="text-sm font-medium text-foreground">{property.pays}</p></div>
                </div>
              </div>
            </div>
            <div className="rounded-md border border-border p-6">
              <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Informations Financieres</h2>
              <div className="h-px bg-border mb-4" />
              <div className="overflow-hidden rounded-md border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Prix :</p>
                <p className="text-base font-medium text-foreground">{property.price}</p>
              </div>
            </div>
            {property.features && property.features.length > 0 && (
              <div className="rounded-md border border-border p-6">
                <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Les Plus</h2>
                <div className="h-px bg-border mb-4" />
                <div className="space-y-2">
                  {property.features.split(',').map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="text-primary">✔</span>
                      <span>{f.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="rounded-md border border-border p-6">
              <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Renseignez-vous sur cette propriete</h2>
              <div className="h-px bg-border mb-4" />
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Nom" />
                  <Input placeholder="Telephone" />
                  <Input placeholder="E-mail" type="email" />
                </div>
                <Textarea rows={4} defaultValue={`Bonjour, Je suis interesse par [${property.title}]`} />
                <Button className="bg-foreground text-background hover:bg-foreground/80">Envoyer</Button>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-md border border-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded bg-primary flex items-center justify-center text-white text-xs font-bold">K</div>
                <div>
                  <p className="font-bold text-foreground text-sm">KEITA IMMOBILIER</p>
                  <p className="text-xs text-muted-foreground">+225 27 21 35 25 47</p>
                  <p className="text-xs text-muted-foreground">+225 27 21 35 25 48</p>
                </div>
              </div>
              <Link href="/property" className="text-xs text-primary hover:underline">Voir nos annonces</Link>
              <div className="mt-4 space-y-3">
                <Input placeholder="Nom" />
                <Input placeholder="Telephone" />
                <Input placeholder="E-mail" type="email" />
                <Textarea rows={4} defaultValue={`Bonjour, je suis interesse par le bien intitule [${property.title}]`} />
                <Button className="w-full bg-foreground text-background hover:bg-foreground/80">Envoyer</Button>
              </div>
            </div>

            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Vu recemment</h3>
              <div className="space-y-4">
                {recentProperties.map((p) => (
                  <Link key={p.id} href={`/property/${p.id}`} className="flex gap-3 hover:opacity-80">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                      {p.images && p.images.length > 0 ? <Image src={p.images[0]} alt={p.title} fill className="object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-muted-foreground">No img</div>}
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
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Calculez vos mensualites</h3>
              <div className="space-y-3">
                {[
                  { prefix: "FCFA", placeholder: "Montant du credit" },
                  { prefix: "FCFA", placeholder: "Apport" },
                  { prefix: "%", placeholder: "Taux interet" },
                  { prefix: "ans", placeholder: "Duree du pret (annees)" },
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

            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Type de bien</h3>
              <div className="space-y-1">
                {["Appartement 2 Pieces","Appartement 3 Pieces","Appartement 4 Pieces","Appartement 5 Pieces","Bureau","Local commercial","Studio","Studio Meuble","Terrain","Villa Basse 4 Pieces","Villa Basse 5 Pieces","Villa Duplex 5 Pieces","Villa Duplex 6 Pieces","Villa Duplex 8 Pieces","Villa triplex 13 pieces"].map(label => (
                  <Link key={label} href="/property" className="flex w-full items-center gap-2 text-sm text-foreground hover:text-primary">
                    <ChevronRight className="h-3 w-3 text-primary" />{label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
