import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import venteImage from "@/app/assets/vente.png"
import vente1Image from "@/app/assets/vente1.png"

export const metadata: Metadata = {
  title: "Vente - Keita Immobilier",
  description: "Vendez ou achetez votre bien immobilier avec Keita Immobilier.",
}

const etapes = [
  "L'estimation commerciale du bien à vendre",
  "Le Marketing et la Promotion du bien à vendre",
  "L'Organisation et la gestion des visites d'acquéreurs potentiels",
  "La Transmission des offres d'achat et la validation d'une offre par le vendeur",
  "La signature de l'acte de vente devant le Notaire",
]

export default function VentePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-64 w-full overflow-hidden">
        <Image
          src={venteImage}
          alt="Vente immobilière"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl font-bold text-white drop-shadow-lg">
            Vente
          </h1>
        </div>
      </section>

      {/* Section Vendre - texte gauche, image droite */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          {/* Texte */}
          <div>
            <h2 className="mb-5 font-serif text-2xl font-bold text-foreground">
              Vous souhaitez vendre votre bien ?
            </h2>
            <p className="mb-6 text-base leading-relaxed text-foreground">
              {"Qu'il s'agisse d'un appartement, d'une maison ou de locaux commerciaux, nous mettons à votre service notre savoir faire et notre expertise pour vous conseiller au mieux, vous accompagner et favoriser la vente de votre bien au meilleur prix."}
            </p>
            <h3 className="mb-4 font-serif text-base font-semibold text-foreground">
              Les étapes d&apos;une vente immobilière réussie KEITA
            </h3>
            <ol className="mb-6 space-y-2">
              {etapes.map((etape, i) => (
                <li key={i} className="flex items-start gap-2 text-base text-foreground">
                  <span className="font-semibold text-foreground">{i + 1}-</span>
                  <span>{etape}</span>
                </li>
              ))}
            </ol>
            <p className="mb-6 text-base leading-relaxed text-foreground">
              {"Contactez nous pour en savoir plus et bénéficiez immédiatement d'une première estimation commerciale de votre bien !"}
            </p>
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Contactez nous pour estimer votre bien
              </Button>
            </Link>
          </div>

          {/* Image droite */}
          <div className="relative h-72 w-full overflow-hidden rounded-md lg:h-96">
            <Image
              src={venteImage}
              alt="Recherche immobilière"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section Acheter - image gauche, texte droite */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image gauche */}
          <div className="relative h-72 w-full overflow-hidden rounded-md lg:h-96">
            <Image
              src={vente1Image}
              alt="Couple cherchant un bien"
              fill
              className="object-cover"
            />
          </div>

          {/* Texte droite */}
          <div>
            <h2 className="mb-5 font-serif text-2xl font-bold text-foreground">
              Vous souhaitez acheter un bien ?
            </h2>
            <p className="mb-6 text-base leading-relaxed text-foreground">
              {"Qu'il s'agisse d'une première acquisition, d'une résidence secondaire ou d'un investissement locatif, nous recherchons pour vous les meilleures opportunités du marché immobilier et vous garantissons la sécurité administrative et juridique de vos transactions durant tout le processus d'achat ; Tout en vous faisant bénéficier de notre réseau de partenaires privilégiés (structures financières, auxilliaires de justice, promoteurs immobiliers, prestataires travaux, etc.)."}
            </p>
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Découvrez nos offres de vente
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