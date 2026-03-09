"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, ChevronRight } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"

export default function CentreAffairesPage() {
  const [recentProps, setRecentProps] = useState<any[]>([])
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

      {/* Barre de recherche */}
      <div className="border-b border-gray-200 bg-white py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6">
          <div className="flex flex-1 items-center gap-2 rounded border border-gray-300 px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input placeholder="Chercher une ville ou un code postal" className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <select className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600">
            <option value="">Type d&apos;opération</option>
            <option value="VENTE">VENTE</option>
            <option value="LOCATION">LOCATION</option>
            <option value="tous">Tous</option>
          </select>
          <select className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600">
            <option value="">Type de bien</option>
            <option>Appartement</option>
            <option>Appartement 2 Pièces</option>
            <option>Appartement 3 Pièces</option>
            <option>Appartement 4 Pièces</option>
            <option>Bureau</option>
            <option>Immeuble</option>
            <option>Local commercial</option>
            <option>Maison</option>
            <option>Studio</option>
            <option>Terrain</option>
            <option>Villa Basse 4 Pièces</option>
            <option>Villa Duplex 5 Pièces</option>
            <option>Tous</option>
          </select>
          <select className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600">
            <option value="">Chambres</option>
            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
            <option value="tous">Tous</option>
          </select>
          <input placeholder="Surface Min" className="w-28 rounded border border-gray-300 px-3 py-2 text-sm outline-none" />
          <input placeholder="Budget Max (FCFA)" className="w-36 rounded border border-gray-300 px-3 py-2 text-sm outline-none" />
          <button className="rounded bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary/90">
            Rechercher
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="text-primary hover:underline">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700">Centre d&apos;Affaires</span>
        </div>

        {/* Titre */}
        <h1 className="mb-8 font-serif text-3xl font-bold text-foreground">
          Centre d&apos;Affaires
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ═══ CONTENU PRINCIPAL ═══ */}
          <div className="lg:col-span-2 space-y-6">

            {/* Article */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">

              {/* Image */}
              <div className="flex justify-center p-6 pb-0">
                <div className="relative h-72 w-full overflow-hidden rounded">
                  <Image
                    src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900"
                    alt="Centre d'Affaires KEITA"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-2xl font-bold">KCA</p>
                    <p className="text-sm opacity-90">KEITA CENTRE D&apos;AFFAIRES</p>
                    <div className="mt-1 space-y-0.5 text-xs opacity-80">
                      <p>→ BUREAUX</p>
                      <p>→ SALLES DE RÉUNION</p>
                      <p>→ DOMICILIATION</p>
                      <p>→ NETWORKING</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu article */}
              <div className="p-6">
                <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
                  Découvrez le Centre d&apos;Affaires de KEITA
                </h2>

                <div className="space-y-4 text-base leading-relaxed text-gray-700">
                  <p>
                    Ouvert depuis 2015 pour répondre aux besoins spécifiques de la clientèle professionnelle à Abidjan, le centre d&apos;Affaires de l&apos;Agence Immobilière KEITA représente une alternative innovante et économique à l&apos;offre de location de bureaux classiques. Idéalement situé sur le Boulevard Valéry Giscard d&apos;Estaing au cœur de Marcory-Zone 4 (au pied de l&apos;échangeur du 3ème pont Henri Konan Bédié), le Centre d&apos;Affaires KEITA est facilement accessible depuis toutes les communes d&apos;Abidjan.
                  </p>
                  <p>
                    Il propose des solutions flexibles et clés en main adaptées aux entrepreneurs, startups, PME et grandes entreprises qui souhaitent disposer d&apos;un espace de travail professionnel sans les contraintes d&apos;un bail commercial classique.
                  </p>

                  {/* Services */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                    {[
                      {
                        icon: "🏢",
                        title: "Bureaux Privés",
                        desc: "Bureaux meublés et équipés, disponibles à la journée, semaine ou au mois.",
                        href: "/centre-affaires",
                      },
                      {
                        icon: "🤝",
                        title: "Salles de Réunion",
                        desc: "Salles équipées (vidéoprojecteur, climatisation, wifi) pour vos réunions et formations.",
                        href: "/centre-affaires",
                      },
                      {
                        icon: "📮",
                        title: "Domiciliation",
                        desc: "Domiciliez votre entreprise à une adresse prestigieuse sur le Boulevard VGE.",
                        href: "/centre-affaires/domiciliation",
                      },
                      {
                        icon: "🌐",
                        title: "Networking",
                        desc: "Rejoignez notre communauté d'entrepreneurs et développez votre réseau.",
                        href: "/centre-affaires",
                      },
                    ].map((s) => (
                      <Link
                        key={s.title}
                        href={s.href}
                        className="group rounded-lg border border-gray-200 p-4 hover:border-primary hover:shadow-md transition-all"
                      >
                        <div className="mb-2 text-2xl">{s.icon}</div>
                        <h4 className="mb-1 font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                          {s.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                      </Link>
                    ))}
                  </div>

                  {/* Avantages */}
                  <div className="rounded-lg bg-gray-50 p-5 mt-2">
                    <h3 className="mb-3 font-semibold text-foreground">Pourquoi choisir le Centre d&apos;Affaires KEITA ?</h3>
                    <ul className="space-y-2">
                      {[
                        "Localisation stratégique sur le Boulevard VGE à Marcory",
                        "Accès Internet haut débit (Fibre optique)",
                        "Climatisation centralisée",
                        "Parking disponible",
                        "Sécurité 24h/24",
                        "Tarifs compétitifs sans engagement long terme",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-0.5 flex-shrink-0 text-primary">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-6 flex flex-wrap items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span>par admin</span>
                    <span>📅 11/10/2019</span>
                    <Link href="/keita-centre-affaires" className="text-primary hover:underline">
                      🔖 KEITA Centre d&apos;Affaires
                    </Link>
                  </div>
                  <Link
                    href="/contact"
                    className="rounded bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Nous contacter
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
                  placeholder="Rechercher..."
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button className="rounded bg-primary px-3 py-2 text-white hover:bg-primary/90">
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
              <Link href="/property" className="block overflow-hidden rounded-lg hover:opacity-90 transition-opacity"><div className="relative">
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