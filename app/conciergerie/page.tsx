import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import conciergeImage from "@/app/assets/concierge.png"

export const metadata: Metadata = {
  title: "Conciergerie - Keita Immobilier",
  description: "Conciergerie immobilière KEITA : entretien, maintenance, services premium personnalisés.",
}

const prestations = [
  "Entretien des locaux / Nettoyage",
  "Gros Travaux / Rénovations",
  "Dépannage ponctuel multiservices (plomberie, électricité, climatisation, menuiserie, etc.)",
  "Entretien des espaces verts",
  "Gardiennage",
  "Aménagement / Ameublement",
  "Déménagement",
  "Abonnements fournisseurs d'énergie et opérateurs TV / Télécom",
  "Assurances (Habitations, Professionnelle, Responsabilité civile)",
  "Sécurité / Domotique",
]

export default function ConciergeriePage() {
  return (
    <main className="min-h-screen">
      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
        .img-pulse {
          animation: pulse-scale 4s ease-in-out infinite;
        }
      `}</style>

      <Header />

      {/* Hero Banner */}
      <section className="relative h-64 w-full overflow-hidden">
        <Image
          src={conciergeImage}
          alt="Conciergerie"
          fill
          className="object-cover img-pulse"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl font-bold text-white drop-shadow-lg">
            Conciergerie
          </h1>
        </div>
      </section>

      {/* Section principale : texte gauche, image droite */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          {/* Texte */}
          <div>
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
              Vous souhaitez bénéficier de services Premium ?
            </h2>
            <p className="mb-3 text-base font-semibold text-foreground">
              Soyez rassurés, nous nous chargeons de tout !
            </p>
            <p className="mb-6 text-base leading-relaxed text-foreground">
              {"Notre conciergerie immobilière vous assiste dans l'entretien et la conservation de vos locaux ainsi que dans la réalisation de vos petites démarches administratives du quotidien, à travers des prestations personnalisées et à la carte exécutées par des professionnels expérimentés :"}
            </p>
            <ul className="mb-8 space-y-2">
              {prestations.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-base text-foreground">
                  <span className="mt-1 text-primary">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mb-5 text-base font-semibold text-foreground">
              Contactez nous pour en savoir plus !
            </p>
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Contactez-nous
              </Button>
            </Link>
          </div>

          {/* Image droite */}
          <div className="relative h-72 w-full overflow-hidden rounded-md lg:h-[480px]">
            <Image
              src={conciergeImage}
              alt="Professionnel conciergerie"
              fill
              className="object-cover object-top img-pulse"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="mb-8 font-serif text-3xl font-bold text-foreground">
          Une autre question ?
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