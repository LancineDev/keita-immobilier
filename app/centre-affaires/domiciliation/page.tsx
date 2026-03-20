"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, ChevronRight } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"

export default function DomiciliationPage() {
  const router = useRouter()
  const [recentProps, setRecentProps] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [montant, setMontant] = useState("")
  const [apport, setApport] = useState("")
  const [taux, setTaux] = useState("")
  const [duree, setDuree] = useState("")
  const [mensualite, setMensualite] = useState<number | null>(null)

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const q = query(collection(db, "properties"), orderBy("createdAt", "desc"), limit(4))
        const snap = await getDocs(q)
        setRecentProps(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch {}
    }
    fetchRecent()
  }, [])

  const handleSearch = () => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return
    router.push(`/conseil-en-immobilier?q=${encodeURIComponent(trimmed)}`)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  const calculer = () => {
    const M = parseFloat(montant.replace(/\s/g, "")) || 0
    const A = parseFloat(apport.replace(/\s/g, "")) || 0
    const T = parseFloat(taux) / 100 / 12
    const N = parseFloat(duree) * 12
    const principal = M - A
    if (!T || !N || !principal) { setMensualite(null); return }
    setMensualite(Math.round((principal * T) / (1 - Math.pow(1 + T, -N))))
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="text-primary hover:underline">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/centre-affaires" className="text-primary hover:underline">Centre d&apos;Affaires</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700">Domiciliation</span>
        </div>

        {/* Titre */}
        <h1 className="mb-8 font-serif text-3xl font-bold text-foreground">
          Domiciliation
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ═══ CONTENU PRINCIPAL ═══ */}
          <div className="lg:col-span-2 space-y-6">

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">

              {/* Image */}
              <div className="flex justify-center p-6 pb-0">
                <div className="relative h-64 w-full overflow-hidden rounded">
                  <Image
                    src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"
                    alt="Domiciliation professionnelle"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
                  Domiciliation Professionnelle au Centre d&apos;Affaires KEITA
                </h2>

                <div className="space-y-4 text-base leading-relaxed text-gray-700">
                  <p>
                    La domiciliation est une solution clé pour les entrepreneurs, indépendants et entreprises qui souhaitent établir leur siège social dans un cadre professionnel, sans les contraintes et les coûts d&apos;une location de bureau classique.
                  </p>
                  <p>
                    Le Centre d&apos;Affaires KEITA vous propose un service de domiciliation professionnelle à une adresse prestigieuse sur le Boulevard Valéry Giscard d&apos;Estaing au cœur de Marcory-Zone 4, l&apos;une des artères les plus fréquentées d&apos;Abidjan.
                  </p>

                  {/* Avantages */}
                  <div className="rounded-lg bg-gray-50 p-5">
                    <h3 className="mb-3 font-semibold text-foreground text-lg">
                      Avantages de notre service de domiciliation :
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Adresse professionnelle prestigieuse sur le Boulevard VGE",
                        "Crédibilité et image professionnelle renforcée",
                        "Réception et gestion de votre courrier",
                        "Notification par SMS/email à chaque réception de courrier",
                        "Services de secrétariat disponibles à la demande",
                        "Accès à des salles de réunion équipées",
                        "Accès à des bureaux privés à l'heure ou à la journée",
                        "Flexibilité — sans engagement long terme",
                        "Tarifs compétitifs adaptés à tous les budgets",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-0.5 flex-shrink-0 text-primary font-bold">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Offres */}
                  <div>
                    <h3 className="mb-4 font-semibold text-foreground text-lg">Nos Offres de Domiciliation</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {[
                        { title: "Starter", price: "Sur devis", desc: "Adresse + réception courrier", color: "border-gray-200" },
                        { title: "Business", price: "Sur devis", desc: "Starter + secrétariat + 2h salle/mois", color: "border-primary" },
                        { title: "Premium", price: "Sur devis", desc: "Business + bureau privé 5j/mois", color: "border-gray-800" },
                      ].map((offer) => (
                        <div key={offer.title} className={`rounded-lg border-2 ${offer.color} p-4 text-center`}>
                          <h4 className="font-bold text-foreground text-base mb-1">{offer.title}</h4>
                          <p className="text-primary font-semibold text-sm mb-2">{offer.price}</p>
                          <p className="text-xs text-gray-600">{offer.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p>
                    Que vous soyez une start-up, un freelancer ou une PME en développement, nos services de domiciliation vous offrent la flexibilité et la professionnalité que vous recherchez pour développer votre activité à Abidjan.
                  </p>
                </div>

                {/* Meta + CTA */}
                <div className="mt-6 flex flex-wrap items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span>par admin</span>
                    <Link href="/keita-centre-affaires" className="text-primary hover:underline">
                      🔖 KEITA Centre d&apos;Affaires
                    </Link>
                  </div>
                  <Link
                    href="/contact"
                    className="rounded bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            </div>

            {/* Lien retour */}
            <div>
              <Link
                href="/keita-centre-affaires"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Retour au Centre d&apos;Affaires KEITA
              </Link>
            </div>
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <div className="space-y-6">

            {/* Recherche */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Recherche</h3>
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Rechercher..."
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  onClick={handleSearch}
                  className="rounded bg-primary px-3 py-2 text-white hover:bg-primary/90 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Vu récemment */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Vu récemment</h3>
              <div className="space-y-4">
                {recentProps.length > 0 ? recentProps.map((p) => (
                  <Link key={p.id} href={`/property/${p.id}`} className="flex gap-3 hover:opacity-80 transition-opacity">
                    <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded border border-gray-200">
                      {p.images?.[0] ? (
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gray-100" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary leading-tight line-clamp-2">{p.title}</p>
                      <p className="mt-1 text-sm font-bold text-foreground">{p.price}</p>
                      <p className="text-xs text-gray-500">
                        {p.chambres && `${p.chambres} Ch`}
                        {p.salles && ` • ${p.salles} SDB`}
                        {p.category && ` • ${p.category}`}
                      </p>
                    </div>
                  </Link>
                )) : (
                  [
                    { title: "Angré 8e Tranche – Appartements Meublés (2 et 3 pièces)", price: "À partir de 300000 F CFA", detail: "Appartement 2 Pièces, Appartement 3 Pièces" },
                    { title: "Angré 8e Tranche – Studio meublé", price: "À partir de 250000 F CFA", detail: "1 Chambre • 1 Salle(s) de bain(s) • Studio" },
                    { title: "Bassam – Appartement meublé 4 Pièces", price: "1.000.000 FCFA", detail: "3 Ch • 3 Salle(s) de bain(s) • Appartement 4 Pièces" },
                    { title: "Riviera Palmeraie – Appartement 4 Pièces", price: "130.000.000 FCFA", detail: "3 Ch • 3 Salle(s) de bain(s) • Appartement 4 Pièces" },
                  ].map((p, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-16 w-20 flex-shrink-0 rounded border border-gray-200 bg-gray-100" />
                      <div>
                        <p className="text-sm font-semibold text-primary leading-tight line-clamp-2">{p.title}</p>
                        <p className="mt-1 text-sm font-bold text-foreground">{p.price}</p>
                        <p className="text-xs text-gray-500">{p.detail}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Exclusivités */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Exclusivités</h3>
              <Link href="/property" className="block overflow-hidden rounded-lg hover:opacity-90 transition-opacity">
                <div className="relative">
                  <div className="absolute left-2 top-2 z-10 rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">EXCLUSIVITÉ</div>
                  <div className="absolute right-2 top-2 z-10 rounded bg-gray-800 px-2 py-0.5 text-xs font-bold text-white">VENTE</div>
                  <div className="relative h-44 w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500"
                      alt="Exclusivité"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-gray-800 py-2 text-center">
                    <p className="font-bold text-white">264.000.000 FCFA</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Calculez vos mensualités */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Calculez vos mensualités</h3>
              <div className="space-y-3">
                {[
                  { prefix: "FCFA", placeholder: "Montant du crédit", val: montant, set: setMontant },
                  { prefix: "FCFA", placeholder: "Apport", val: apport, set: setApport },
                  { prefix: "%", placeholder: "Taux d'intérêt", val: taux, set: setTaux },
                  { prefix: "📅", placeholder: "Durée du prêt (années)", val: duree, set: setDuree },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 rounded border border-gray-300 px-3 py-2">
                    <span className="w-8 text-xs text-gray-400">{f.prefix}</span>
                    <input
                      value={f.val}
                      onChange={e => f.set(e.target.value)}
                      placeholder={f.placeholder}
                      className="flex-1 bg-transparent text-sm outline-none"
                    />
                  </div>
                ))}
                <select className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                  <option>Mensuel</option>
                  <option>Annuel</option>
                </select>
                <button
                  onClick={calculer}
                  className="w-full rounded bg-gray-800 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
                >
                  Calculer
                </button>
                {mensualite !== null && (
                  <div className="rounded bg-primary/10 px-4 py-3 text-center">
                    <p className="text-xs text-gray-500">Mensualité estimée</p>
                    <p className="text-lg font-bold text-primary">
                      {mensualite.toLocaleString("fr-FR")} FCFA/mois
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}