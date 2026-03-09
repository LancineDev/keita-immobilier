"use client"
import { useState, useEffect } from "react"
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
import { MapPin, ChevronRight, ChevronLeft, Search, Heart, Share2, Loader2 } from "lucide-react"

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

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return
      setLoading(true)
      try {
        const docSnap = await getDoc(doc(db, "properties", id))
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() } as Property)
        } else {
          setError("Propriété non trouvée")
        }
      } catch (e) {
        console.error(e)
        setError("Erreur lors du chargement")
      }
      setLoading(false)
    }
    fetchProperty()
  }, [id])

  const [currentImage, setCurrentImage] = useState(0)

  // recently viewed / recent listings sidebar
  const [recentProperties, setRecentProperties] = useState<Property[]>([])

  useEffect(() => {
    // fetch latest properties, excluding current
    const q = query(
      collection(db, "properties"),
      orderBy("createdAt", "desc"),
      limit(5)
    )
    const unsub = onSnapshot(q, snapshot => {
      const props: Property[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Property))
      setRecentProperties(props.filter(p => p.id !== id))
    })
    return () => unsub()
  }, [id])

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

  if (error || !property) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-red-500">{error || "Propriété non trouvée"}</p>
        </div>
        <Footer />
      </main>
    )
  }

  const images = property.images || []

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
          </select>
          <Button className="bg-primary text-white hover:bg-primary/90">Rechercher</Button>
        </div>
      </div>

      {/* Hero image avec slider */}
      <section className="relative h-[500px] w-full overflow-hidden bg-black">
        {/* Image principale */}
        {images.length > 0 && (
          <Image
            src={images[currentImage]}
            alt={property.title}
            fill
            className="object-cover opacity-90"
            priority
          />
        )}

        {/* Navigation images */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Overlay top — titre + prix */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-8 py-8">
          <h1 className="font-serif text-2xl font-bold text-white">{property.title}</h1>
          <p className="mt-1 text-xl font-bold text-white">{property.price}</p>
          <Link href="/contact">
            <Button className="mt-4 bg-primary text-white hover:bg-primary/90">
              {"Contacter l'agence"}
            </Button>
          </Link>
        </div>

        {/* Boutons navigation slider */}
        <button
          onClick={() => setCurrentImage((currentImage - 1 + images.length) % images.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/80"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => setCurrentImage((currentImage + 1) % images.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/80"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Icônes top droite */}
        <div className="absolute right-4 top-4 flex gap-2">
          <button className="rounded-full bg-black/50 p-2 text-white hover:bg-black/80">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="rounded-full bg-black/50 p-2 text-white hover:bg-black/80">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* Badge type */}
        <div className="absolute left-4 top-4">
          <span className={`rounded px-3 py-1 text-sm font-bold text-white ${property.type === "VENTE" ? "bg-foreground" : "bg-primary"}`}>
            {property.type}
          </span>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 py-3 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">Accueil</Link>
        <span className="mx-2">›</span>
        <Link href="/property" className="text-primary hover:underline">Propriétés</Link>
        <span className="mx-2">›</span>
        <span>{property.title}</span>
      </div>

      {/* Contenu principal 2 colonnes */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Colonne gauche — détails */}
          <div className="space-y-6 lg:col-span-2">

            {/* Localisation */}
            <div className="rounded-md border border-border p-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Lieu : {property.ville}</span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-md border border-border p-6">
              <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Description</h2>
              <div className="h-px bg-border mb-4" />
              <p className="text-base leading-relaxed text-foreground">{property.description}</p>
            </div>

            {/* Localisation détaillée */}
            <div className="rounded-md border border-border p-6">
              <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Localisation :</h2>
              <div className="h-px bg-border mb-4" />
              <div className="overflow-hidden rounded-md border border-border">
                <div className="grid grid-cols-3 divide-x divide-border bg-muted/30">
                  <div className="p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Ville:</p>
                    <p className="text-sm font-medium text-foreground">{property.ville}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Quartier :</p>
                    <p className="text-sm font-medium text-foreground">{property.quartier}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Pays:</p>
                    <p className="text-sm font-medium text-foreground">{property.pays}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations Financières */}
            <div className="rounded-md border border-border p-6">
              <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Informations Financières</h2>
              <div className="h-px bg-border mb-4" />
              <div className="overflow-hidden rounded-md border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Prix :</p>
                <p className="text-base font-medium text-foreground">{property.price}</p>
              </div>
            </div>

            {/* Les Plus */}
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

            {/* Formulaire de contact */}
            <div className="rounded-md border border-border p-6">
              <h2 className="mb-4 font-serif text-xl font-bold text-foreground">
                Renseignez-vous sur cette propriété
              </h2>
              <div className="h-px bg-border mb-4" />
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Nom" />
                  <Input placeholder="Téléphone" />
                  <Input placeholder="E-mail" type="email" />
                </div>
                <Textarea
                  rows={4}
                  defaultValue={`Bonjour, Je suis intéressé par [${property.title}]`}
                />
                <Button className="bg-foreground text-background hover:bg-foreground/80">
                  Envoyer
                </Button>
              </div>
            </div>

          </div>

          {/* Sidebar droite */}
          <div className="space-y-6 lg:col-span-1">

            {/* Agence */}
            <div className="rounded-md border border-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-10 w-10">
                  {/* Logo placeholder */}
                  <div className="h-10 w-10 rounded bg-primary flex items-center justify-center text-white text-xs font-bold">K</div>
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">KEITA IMMOBILIER</p>
                  <p className="text-xs text-muted-foreground">+225 27 21 35 25 47</p>
                  <p className="text-xs text-muted-foreground">+225 27 21 35 25 48</p>
                </div>
              </div>
              <Link href="/property" className="text-xs text-primary hover:underline">
                Voir nos annonces
              </Link>
              <div className="mt-4 space-y-3">
                <Input placeholder="Nom" />
                <Input placeholder="Téléphone" />
                <Input placeholder="E-mail" type="email" />
                <Textarea
                  rows={4}
                  defaultValue={`Bonjour, je suis intéressé par le bien intitulé [${property.title}]`}
                />
                <Button className="w-full bg-foreground text-background hover:bg-foreground/80">
                  Envoyer
                </Button>
              </div>
            </div>

            {/* Vu récemment */}
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Vu récemment</h3>
              <div className="space-y-4">
                {recentProperties.map((p) => (
                  <Link key={p.id} href={`/property/${p.id}`} className="flex gap-3 hover:opacity-80">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                      {p.images && p.images.length > 0 ? (
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-muted-foreground">No img</div>
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

            {/* Calculez vos mensualités */}
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">
                Calculez vos mensualités
              </h3>
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

            {/* Type de bien sidebar */}
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Type de bien</h3>
              <div className="space-y-1">
                {[
                  { label: "Appartement 2 Pièces", count: 3 },
                  { label: "Appartement 3 Pièces", count: 5 },
                  { label: "Appartement 4 Pièces", count: 9 },
                  { label: "Appartement 5 Pièces", count: 1 },
                  { label: "Bureau", count: 1 },
                  { label: "Local commercial", count: 2 },
                  { label: "Studio", count: 1 },
                  { label: "Studio Meublé", count: 2 },
                  { label: "Terrain", count: 2 },
                  { label: "Villa Basse 4 Pièces", count: 5 },
                  { label: "Villa Basse 5 Pièces", count: 2 },
                  { label: "Villa Duplex 5 Pièces", count: 4 },
                  { label: "Villa Duplex 6 Pièces", count: 2 },
                  { label: "Villa Duplex 8 Pièces", count: 1 },
                  { label: "Villa triplex 13 pièces", count: 1 },
                ].map(t => (
                  <Link
                    key={t.label}
                    href="/property"
                    className="flex w-full items-center gap-2 text-sm text-foreground hover:text-primary"
                  >
                    <ChevronRight className="h-3 w-3 text-primary" />
                    {t.label} <span className="text-muted-foreground">({t.count})</span>
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