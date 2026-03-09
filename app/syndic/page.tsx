import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import syndicImage from "@/app/assets/Syndic.png"

export const metadata: Metadata = {
  title: "Syndic - Keita Immobilier",
  description: "Gestion professionnelle de copropriétés avec KEITA. 3 formules personnalisées.",
}

const formules = [
  {
    name: 'Formule « À LA CARTE »',
    description:
      "Nous intervenons ponctuellement auprès des Syndic bénévoles pour la réalisation de missions spécifiques (non maîtrisées ou chronophages)",
  },
  {
    name: 'Formule « CLASSIQUE »',
    description:
      "Nous assurons une gestion courante complète et transparente de votre copropriété, dans le respect de la réglementation en vigueur.",
  },
  {
    name: 'Formule « OPTIMALE »',
    description:
      "À travers des services additionnels à ceux de l'offre « Classique », nous vous garantissons une totale sérénité dans la gestion de votre copropriété.",
  },
]

export default function SyndicPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-64 w-full overflow-hidden">
        <Image
          src={syndicImage}
          alt="Syndic de copropriété"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl font-bold text-white drop-shadow-lg">
            Syndic
          </h1>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-5 font-serif text-2xl font-bold text-foreground">
          Vous souhaitez confier la gestion de votre copropriété ?
        </h2>
        <p className="mb-4 text-base leading-relaxed text-foreground">
          La gestion de Copropriété est une activité encadrée et réglementée en Côte d&apos;Ivoire.
        </p>
        <p className="mb-4 text-base leading-relaxed text-foreground">
          {"Toute copropriété se doit de disposer d'un Syndic pour assurer la bonne conservation de l'immeuble, veiller au respect du règlement de copropriété et garantir une répartition équitable des charges entre tous les copropriétaires."}
        </p>
        <p className="mb-10 text-base leading-relaxed text-foreground">
          {"Conscient des enjeux d'une telle responsabilité, l'Agence immobilière Keita vous accompagne depuis plus de 10 ans dans la gestion administrative, technique et financière de vos copropriétés, à travers 3 formules personnalisées, en fonction de vos besoins :"}
        </p>

        {/* 3 Formules — fond rouge + boîte blanche avec titre + texte */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {formules.map((formule) => (
            <div
              key={formule.name}
              className="flex items-stretch justify-center rounded-md bg-primary p-5"
            >
              <div className="flex flex-col items-center justify-start rounded-sm bg-white p-5 text-center">
                <h3 className="mb-3 font-serif text-base font-bold text-foreground">
                  {formule.name}
                </h3>
                <p className="text-sm leading-relaxed text-foreground">
                  {formule.description}
                </p>
              </div>
            </div>
          ))}
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