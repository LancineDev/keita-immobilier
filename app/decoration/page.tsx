import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Décoration - Keita Immobilier",
  description: "Découvrez nos conseils et astuces de décoration pour transformer votre intérieur.",
}

const decoTips = [
  {
    title: "Jouez avec les coussins et les plaids",
    description: "Changer les coussins et les plaids est le moyen le plus rapide et le moins coûteux de transformer l'ambiance de votre salon. Optez pour des couleurs vives ou des motifs tendance.",
  },
  {
    title: "Repeignez un mur en couleur d'accent",
    description: "Inutile de repeindre toute la pièce. Un seul mur peint dans une couleur audacieuse peut totalement changer l'atmosphère de votre salon.",
  },
  {
    title: "Ajoutez des plantes vertes",
    description: "Les plantes apportent de la vie et de la fraîcheur à n'importe quel espace. Elles sont peu coûteuses et faciles à entretenir pour la plupart.",
  },
  {
    title: "Réorganisez vos meubles",
    description: "Parfois, il suffit de déplacer les meubles pour donner une nouvelle vie à votre salon. Essayez différentes configurations pour optimiser l'espace.",
  },
  {
    title: "Éclairez différemment",
    description: "L'éclairage joue un rôle crucial dans l'ambiance d'une pièce. Ajoutez des lampes d'appoint, des bougies ou des guirlandes lumineuses.",
  },
  {
    title: "Utilisez le papier peint",
    description: "Le papier peint est un excellent moyen d'ajouter du caractère et de la texture à vos murs sans engagement permanent.",
  },
]

export default function DecorationPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-serif text-4xl font-bold text-white">
            Conseils Décoration
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Transformez votre intérieur avec nos astuces pratiques et économiques
          </p>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-12 font-serif text-3xl font-bold text-foreground text-center">
          Nos Meilleures Astuces
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {decoTips.map((tip, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-background p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                {tip.title}
              </h3>
              <p className="text-foreground leading-relaxed">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Article */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">
            Article Recommandé
          </h2>
          <p className="mb-4 text-foreground">
            Découvrez notre article complet: "5 Astuces décoration pour relooker votre salon sans vous ruiner"
          </p>
          <Link href="/articles/5-astuces-deco">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Lire l'article complet →
            </Button>
          </Link>
        </div>
      </section>

      {/* Back Link */}
      <section className="mx-auto max-w-3xl px-6 py-8">
        <div className="text-center">
          <Link href="/articles">
            <Button variant="outline">
              Retour aux articles
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
