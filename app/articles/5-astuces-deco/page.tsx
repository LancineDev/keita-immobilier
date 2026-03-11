"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, ChevronRight } from "lucide-react"
import conseilImage from "@/app/assets/conseil.jpg"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"

export default function AstucesDecoPage() {
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
            <option>VENTE</option>
            <option>LOCATION</option>
            <option>Tous</option>
          </select>
          <select className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600">
            <option value="">Type de bien</option>
            <option>Appartement</option>
            <option>Bureau</option>
            <option>Maison</option>
            <option>Studio</option>
            <option>Terrain</option>
            <option>Villa Basse</option>
            <option>Villa Duplex</option>
            <option>Tous</option>
          </select>
          <select className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600">
            <option value="">Chambres</option>
            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}
            <option>Tous</option>
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
          <Link href="/decoration" className="text-primary hover:underline">Décoration</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700">Idées Déco</span>
        </div>

        {/* Titre page */}
        <h1 className="mb-8 font-serif text-3xl font-bold text-foreground">
          Idées Déco
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ═══ CONTENU PRINCIPAL ═══ */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">

              {/* Image centrée */}
              <div className="flex justify-center p-6 pb-0">
                <div className="relative h-64 w-full overflow-hidden rounded">
                  <Image
                    src={conseilImage}
                    alt="5 Astuces deco salon"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="p-6">
                {/* Tags */}
                <div className="mb-3 flex flex-wrap gap-2">
                  <Link href="/conseil-en-immobilier" className="text-xs font-medium text-primary hover:underline">
                    immobilier
                  </Link>
                  <Link href="/conseil-en-immobilier" className="text-xs font-medium text-primary hover:underline">
                    Décoration
                  </Link>
                </div>

                {/* Titre article */}
                <h2 className="mb-5 font-serif text-2xl font-bold text-foreground">
                  5 Astuces déco pour relooker votre salon sans vous ruiner
                </h2>

                {/* Contenu */}
                <div className="space-y-5 text-base leading-relaxed text-gray-700">
                  <p>
                    La déco de votre salon vous déprime ? Vous avez des envies de changements ? Le salon est la pièce centrale de la maison. C&apos;est celle où on reçoit des invités, où on se retrouve en famille (ou entre amis) et celle où on passe des moments de détente. Avec la crise sanitaire mondiale de la COVID-19, nous passons encore plus de temps chez nous et il est essentiel de se sentir bien dans son intérieur.
                  </p>
                  <p>
                    Voici 5 astuces simples et économiques pour lui redonner vie sans dépenser une fortune.
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        num: "1",
                        title: "Jouez avec les coussins et les plaids",
                        content: "Changer les coussins et les plaids est le moyen le plus rapide et le moins coûteux de transformer l'ambiance de votre salon. Optez pour des couleurs vives ou des motifs tendance pour apporter une touche de modernité. N'hésitez pas à mélanger les textures et les tailles pour un effet plus dynamique.",
                      },
                      {
                        num: "2",
                        title: "Repeignez un mur en couleur d'accent",
                        content: "Inutile de repeindre toute la pièce. Un seul mur peint dans une couleur audacieuse peut totalement changer l'atmosphère de votre salon. Choisissez une couleur qui s'harmonise avec vos meubles existants et n'ayez pas peur d'aller vers des teintes profondes comme le bleu nuit, le vert forêt ou le terracotta.",
                      },
                      {
                        num: "3",
                        title: "Ajoutez des plantes vertes",
                        content: "Les plantes apportent de la vie et de la fraîcheur à n'importe quel espace. Elles sont peu coûteuses et faciles à entretenir pour la plupart. Les grandes plantes comme le monstera ou le ficus apportent une touche tropicale, tandis que les petites succulentes sont parfaites pour les étagères.",
                      },
                      {
                        num: "4",
                        title: "Réorganisez vos meubles",
                        content: "Parfois, il suffit de déplacer les meubles pour donner une nouvelle vie à votre salon. Essayez différentes configurations pour optimiser l'espace et améliorer la circulation. Pensez à créer des zones distinctes : une zone de détente, une zone de lecture...",
                      },
                      {
                        num: "5",
                        title: "Éclairez différemment",
                        content: "L'éclairage joue un rôle crucial dans l'ambiance d'une pièce. Ajoutez des lampes d'appoint, des bougies ou des guirlandes lumineuses pour créer une atmosphère chaleureuse. Variez les sources de lumière à différentes hauteurs pour un effet cosy et sophistiqué.",
                      },
                    ].map((item) => (
                      <div key={item.num} className="border-l-4 border-primary pl-4">
                        <h3 className="mb-2 font-serif text-lg font-bold text-foreground">
                          {item.num}. {item.title}
                        </h3>
                        <p className="text-gray-700">{item.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                    <p className="text-sm font-semibold text-foreground">
                      💡 Bon à savoir : Ces 5 astuces peuvent être réalisées avec un budget limité et sans faire appel à un professionnel. Un simple week-end suffit pour transformer complètement l&apos;ambiance de votre salon !
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-6 flex flex-wrap items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span>par userpro</span>
                    <span>📅 10/10/2020</span>
                    <Link href="/conseil-en-immobilier" className="text-primary hover:underline">
                      🔖 immobilier
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