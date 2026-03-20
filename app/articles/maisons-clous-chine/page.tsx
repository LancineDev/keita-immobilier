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

export default function MaisonsClousPage() {
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
          <Link href="/conseil-en-immobilier" className="text-primary hover:underline">Le Saviez-Vous ?</Link>
        </div>

        {/* Titre page */}
        <h1 className="mb-8 font-serif text-3xl font-bold text-foreground">
          Le Saviez-Vous ?
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ═══ CONTENU PRINCIPAL ═══ */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">

              {/* Image */}
              <div className="flex justify-center p-6 pb-0">
                <div className="relative h-64 w-full overflow-hidden rounded">
                  <Image
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"
                    alt="Maisons Clous en Chine"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1">
                    <p className="text-xs font-medium text-white">Maison Autoroute — Chine</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Tag */}
                <div className="mb-3">
                  <Link href="/conseil-en-immobilier" className="text-xs font-medium text-primary hover:underline">
                    Le Saviez-Vous ?
                  </Link>
                </div>

                {/* Titre article */}
                <h2 className="mb-5 font-serif text-2xl font-bold text-foreground">
                  Les « Maisons Clous » en Chine
                </h2>

                {/* Contenu */}
                <div className="space-y-4 text-base leading-relaxed text-gray-700">
                  <p>
                    Découvertes surprenantes ou atypiques, informations insolites, retrouvez tous les mois des perles de l&apos;actualité immobilière d&apos;ici et d&apos;ailleurs glanées sur la toile…
                  </p>

                  <div className="rounded-lg bg-primary/5 border-l-4 border-primary p-4">
                    <p className="font-semibold text-foreground text-sm">
                      LES « MAISONS CLOUS » EN CHINE : Une maison duplex au milieu de l&apos;Autoroute du Nord à Abidjan ? Impensable en Côte d&apos;Ivoire… mais tout à fait possible en Chine !
                    </p>
                  </div>

                  <p>
                    Véritable phénomène en Chine, on appelle « maisons clous » (钉子户, <em>dīngzihu</em>) ces habitations isolées qui résistent à la démolition au milieu de chantiers de construction ou d&apos;infrastructures routières. Leurs propriétaires refusent catégoriquement de vendre ou de quitter leur bien malgré la pression — parfois intense — des promoteurs immobiliers et des autorités locales.
                  </p>

                  <p>
                    Ces maisons, parfois entourées de trous béants, encerclées de routes ou perchées sur des îlots de terre au milieu d&apos;autoroutes, sont devenues le symbole fort de la résistance individuelle face aux grands projets d&apos;urbanisation qui transforment à toute vitesse les villes chinoises.
                  </p>

                  <p>
                    Certaines sont restées debout pendant des années, voire des décennies, leurs propriétaires revendiquant une compensation financière jugée équitable. La plus célèbre est sans doute une maison de Chongqing restée debout au centre d&apos;un immense chantier pendant plus de trois ans, devenant une icône médiatique mondiale.
                  </p>

                  <p>
                    Ce phénomène illustre de manière frappante les tensions croissantes entre développement économique effréné et droits des propriétaires privés dans un pays en pleine mutation urbaine. Il soulève aussi des questions universelles sur le respect du droit de propriété et la juste valeur d&apos;un bien face aux intérêts collectifs.
                  </p>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-600 italic">
                      🏠 En Côte d&apos;Ivoire, des situations similaires peuvent se présenter lors de projets d&apos;infrastructure. Notre équipe juridique peut vous conseiller sur vos droits en matière d&apos;expropriation et d&apos;indemnisation.
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-6 flex flex-wrap items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span>par admin</span>
                    <span>📅 28/03/2019</span>
                    <Link href="/conseil-en-immobilier" className="text-primary hover:underline">
                      🔖 Le Saviez-Vous ?
                    </Link>
                  </div>
                  <Link
                    href="/conseil-en-immobilier"
                    className="rounded bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Retour aux conseils
                  </Link>
                </div>
              </div>
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
                  <option>Bi-mensuel</option>
                  <option>Hebdomadaire</option>
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