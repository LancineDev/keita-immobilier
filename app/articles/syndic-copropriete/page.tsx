"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore"

interface PropSnippet {
  id: string
  title: string
  price: string
  type: string
  images?: string[]
}

const pulseStyle: React.CSSProperties = {
  animation: "pulse-scale 4s ease-in-out infinite",
}

export default function SyndicArticlePage() {
  const [recentProperties, setRecentProperties] = useState<PropSnippet[]>([])

  useEffect(() => {
    const q = query(
      collection(db, "properties"),
      orderBy("createdAt", "desc"),
      limit(4)
    )
    const unsub = onSnapshot(q, snap => {
      const props: PropSnippet[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as any))
      setRecentProperties(props)
    })
    return () => unsub()
  }, [])

  return (
    <main className="min-h-screen">
      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
      `}</style>

      <Header />

      {/* Barre de recherche */}
      <div className="border-b border-border bg-background py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6">
          <div className="flex flex-1 items-center gap-2 rounded border border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Chercher une ville ou un code postal" className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <select className="rounded border border-border px-3 py-2 text-sm">
            <option>Type d&apos;opération</option>
            <option>Vente</option>
            <option>Location</option>
          </select>
          <select className="rounded border border-border px-3 py-2 text-sm">
            <option>Type de bien</option>
          </select>
          <Button className="bg-primary text-white hover:bg-primary/90">Rechercher</Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 py-3 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">Accueil</Link>
        <span className="mx-2">›</span>
        <span>Définition du mois</span>
      </div>

      {/* Contenu 2 colonnes */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

          {/* Colonne gauche — Article */}
          <div className="lg:col-span-2">
            <h1 className="mb-6 font-serif text-3xl font-bold text-foreground">
              Définition du mois
            </h1>

            {/* Image article */}
            <div className="relative mb-6 h-64 w-full overflow-hidden rounded-md">
              <Image
                src="/images/syndic-hero.jpeg"
                alt="Syndic de Copropriété"
                fill
                className="object-cover"
                style={pulseStyle}
              />
            </div>

            {/* Card article */}
            <div className="rounded-md border border-border bg-background p-6">
              <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
                Le SYNDIC de Copropriété
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-foreground">
                <p>Le SYNDIC de Copropriété est une personne physique ou morale désignée par l&apos;ensemble des copropriétaires d&apos;un ensemble immobilier pour assurer l&apos;administration, l&apos;entretien et la conservation des parties communes de la copropriété.</p>
                <p>Désigné pour une durée d&apos;un an renouvelable dans le cadre d&apos;une Assemblée Générale, le Syndic de Copropriété a plusieurs missions strictement définies par la loi :</p>
                <ul className="space-y-2 pl-4">
                  {[
                    "Assurer l'exécution des dispositions du règlement de copropriété",
                    "Administrer l'immeuble, pourvoir à sa conservation, à sa garde et à son entretien",
                    "Établir et soumettre au vote de l'assemblée générale le budget prévisionnel",
                    "Tenir la comptabilité du syndicat des copropriétaires",
                    "Représenter le syndicat dans tous les actes civils et en justice",
                    "Soumettre au vote de l'assemblée générale toute convention entre le syndicat et le syndic",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>En Côte d&apos;Ivoire, la gestion de Copropriété est encadrée et réglementée. Toute copropriété se doit de disposer d&apos;un Syndic pour assurer la bonne conservation de l&apos;immeuble, veiller au respect du règlement de copropriété et garantir une répartition équitable des charges entre tous les copropriétaires.</p>
              </div>

              {/* Meta */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>par userpro</span>
                  <span>30/10/2020</span>
                  <Link href="/articles/syndic-copropriete" className="text-primary hover:underline">
                    Définition du mois
                  </Link>
                </div>
                <Link href="/syndic">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    Lire Plus
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Colonne droite — Sidebar */}
          <div className="space-y-8">

            {/* Recherche */}
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-3 font-serif text-lg font-bold text-foreground">Recherche</h3>
              <div className="flex gap-2">
                <Input placeholder="Rechercher" className="flex-1" />
                <Button size="icon" className="bg-primary text-white hover:bg-primary/90">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Vu récemment */}
            <div className="rounded-md border border-border p-4">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Vu récemment</h3>
              <div className="space-y-4">
                {recentProperties.map((prop) => (
                  <Link key={prop.id} href={`/property/${prop.id}`} className="flex gap-3 hover:opacity-80">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                      {prop.images && prop.images.length > 0 ? (
                        <Image
                          src={prop.images[0]}
                          alt={prop.title}
                          fill
                          className="object-cover"
                          style={pulseStyle}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-muted-foreground">No img</div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-tight">{prop.title}</p>
                      <p className="text-sm font-bold text-primary">{prop.price}</p>
                      <p className="text-xs text-muted-foreground">{prop.type}</p>
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
                <div className="flex items-center gap-2 rounded border border-border px-3 py-2">
                  <span className="text-xs text-muted-foreground">FCFA</span>
                  <input placeholder="Montant du crédit" className="flex-1 bg-transparent text-sm outline-none" />
                </div>
                <div className="flex items-center gap-2 rounded border border-border px-3 py-2">
                  <span className="text-xs text-muted-foreground">FCFA</span>
                  <input placeholder="Apport" className="flex-1 bg-transparent text-sm outline-none" />
                </div>
                <div className="flex items-center gap-2 rounded border border-border px-3 py-2">
                  <span className="text-xs text-muted-foreground">%</span>
                  <input placeholder="Taux d'intérêt" className="flex-1 bg-transparent text-sm outline-none" />
                </div>
                <div className="flex items-center gap-2 rounded border border-border px-3 py-2">
                  <input placeholder="Durée du prêt (années)" className="flex-1 bg-transparent text-sm outline-none" />
                </div>
                <select className="w-full rounded border border-border px-3 py-2 text-sm">
                  <option>Mensuel</option>
                  <option>Annuel</option>
                </select>
                <Button className="w-full bg-foreground text-background hover:bg-foreground/80">
                  Calculer
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}