import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import gestionImage from "@/app/assets/gestionimg.jpg"

export const metadata: Metadata = {
  title: "Gestion Locative - Keita Immobilier",
  description: "Confiez la gestion de votre patrimoine immobilier à KEITA.",
}

const avantages = [
  "Éviter les erreurs en matière de réglementation immobilière et foncière (cadre juridique et fiscal, règles d'urbanisme et d'aménagement).",
  "Gagner du temps, en nous laissant assurer la gestion courante de votre bien avec rigueur, efficacité, réactivité et disponibilité (interface-client, encaissement des loyers, gestion des travaux, etc.)",
  "Assurer la rentabilité de votre bien dont la valeur commerciale sera optimisée.",
  "Recouvrer (par voie amiable ou contentieuse) les éventuels impayés de loyers.",
]

const formules = [
  { name: "Formule Économie" },
  { name: "Formule Confort" },
  { name: "Formule Sérénité" },
]

export default function GestionPage() {
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
          src={gestionImage}
          alt="Gestion Locative"
          fill
          className="object-cover img-pulse"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl font-bold text-white drop-shadow-lg">
            Gestion Locative
          </h1>
        </div>
      </section>

      {/* Section principale : texte gauche, image droite */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          {/* Texte */}
          <div>
            <h2 className="mb-5 font-serif text-2xl font-bold text-foreground">
              Vous souhaitez faire gérer votre bien ?
            </h2>
            <p className="mb-4 text-base leading-relaxed text-foreground">
              {"L'immobilier est un secteur dense, particulièrement complexe et en perpétuelle évolution et gérer un bien immobilier s'avère être une responsabilité des plus chronophages et une activité des plus délicates."}
            </p>
            <p className="mb-5 text-base leading-relaxed text-foreground">
              {"À KEITA, la gestion locative est notre cœur de métier depuis toujours et en nous confiant votre bien, vous bénéficierez de notre expertise et de nos conseils pour :"}
            </p>
            <ul className="mb-8 space-y-3">
              {avantages.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-base text-foreground">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mb-8 text-base leading-relaxed text-foreground">
              Dans le souci de toujours mieux vous satisfaire, nous avons décliné 3 formules de Gestion locative en fonction de vos besoins et de votre budget :
            </p>

            {/* 3 Formules cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {formules.map((formule) => (
                <div
                  key={formule.name}
                  className="flex items-center justify-center rounded-md bg-primary p-6"
                >
                  <div className="flex items-center justify-center rounded-sm bg-white px-4 py-6 text-center">
                    <h3 className="font-serif text-base font-bold text-foreground">
                      {formule.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image droite */}
          <div className="relative h-72 w-full overflow-hidden rounded-md lg:h-[500px]">
            <Image
              src={gestionImage}
              alt="Équipe KEITA gestion"
              fill
              className="object-cover img-pulse"
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