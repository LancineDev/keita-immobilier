import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import locationImage from "@/app/assets/loaction.png"

export const metadata: Metadata = {
  title: "Location - Keita Immobilier",
  description: "Confiez-nous la commercialisation de votre bien en location.",
}

const steps = [
  "Réaliser une estimation commerciale fiable de votre bien",
  "Assurer la promotion de votre bien sur tous nos canaux de communication",
  "Sélectionner pour vous les meilleurs profils de locataires",
  "Organiser toutes les visites",
  "Effectuer toutes les formalités d'usage pour l'entrée de votre locataire",
]

export default function LocationPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-64 w-full overflow-hidden">
        <Image
          src={locationImage}
          alt="Location immobilière"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl font-bold text-white drop-shadow-lg">
            Location
          </h1>
        </div>
      </section>

      {/* Section 1 - Faire louer : texte gauche, image droite */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          {/* Texte */}
          <div>
            <h2 className="mb-5 font-serif text-2xl font-bold text-foreground">
              Vous souhaitez faire louer votre bien ?
            </h2>
            <p className="mb-5 text-base leading-relaxed text-foreground">
              {"Que ce soit de façon occasionnelle, saisonnière ou pour une longue durée, confiez-nous la commercialisation de votre bien et soyez assurés d'une location aux meilleurs prix. Nous nous chargerons de :"}
            </p>
            <ul className="mb-6 space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-base text-foreground">
                  <span className="mt-1 text-primary">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Contactez nous pour louer votre bien
              </Button>
            </Link>
          </div>

          {/* Image droite */}
          <div className="relative h-72 w-full overflow-hidden rounded-md lg:h-96">
            <Image
              src={locationImage}
              alt="Agent immobilier"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 2 - Louer un bien : image gauche, texte droite */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image gauche */}
          <div className="relative h-72 w-full overflow-hidden rounded-md lg:h-96">
            <Image
              src={locationImage}
              alt="Remise de clés"
              fill
              className="object-cover"
            />
          </div>

          {/* Texte droite */}
          <div>
            <h2 className="mb-5 font-serif text-2xl font-bold text-foreground">
              Vous souhaitez louer un bien ?
            </h2>
            <p className="mb-6 text-base leading-relaxed text-foreground">
              {"Grâce à notre maîtrise de la cartographie Abidjanaise et les connexions solides que nous avons tissées avec les partenaires du secteur depuis plusieurs années (Agences immobilières, Promoteurs, Notaires, Agents d'affaires), nous recherchons pour vous les biens les plus en adéquation avec vos critères de sélection et vous accompagnons dans la réalisation de toutes les formalités."}
            </p>
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Découvrez nos offres de location
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA pleine largeur */}
      <section className="py-16 text-center">
        <h2 className="mb-8 font-serif text-3xl font-bold text-foreground">
          Vous souhaitez en savoir plus ?
        </h2>
        <Link href="/contact">
          <Button size="lg" className="bg-primary px-10 text-primary-foreground hover:bg-primary/90">
            Contactez-nous !
          </Button>
        </Link>
      </section>

      <Footer />
    </main>
  )
}