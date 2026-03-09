
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CentreAffairesArticlePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-4 flex flex-wrap gap-2">
          <Link href="/keita-centre-affaires" className="text-sm font-medium text-primary hover:underline">Keita Centre d&apos;Affaires</Link>
          <Link href="/centre-affaires" className="text-sm font-medium text-primary hover:underline">Centre d&apos;Affaires</Link>
          <Link href="/centre-affaires/domiciliation" className="text-sm font-medium text-primary hover:underline">Domiciliation</Link>
        </div>
        <h1 className="mb-4 font-serif text-3xl font-bold text-foreground">
          Découvrez le Centre d&apos;Affaires de Keita
        </h1>
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-md">
          <Image src="/images/gestion-hero.svg" alt="Centre d'Affaires Keita" fill className="object-cover" />
        </div>
        <div className="space-y-4 text-base leading-relaxed text-foreground">
          <p>Ouvert depuis 2015 pour répondre aux besoins spécifiques de la clientèle professionnelle, le Centre d'Affaires Keita (KCA) propose des solutions flexibles et clés en main pour les entreprises et entrepreneurs.</p>
          <p>Nos services incluent :</p>
          <ul className="space-y-2 pl-4">
            {[
              "Bureaux privés entièrement équipés",
              "Espaces de coworking",
              "Salles de réunion meublées et équipées",
              "Domiciliation professionnelle",
              "Accès internet haut débit",
              "Services de secrétariat",
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <p>Idéalement situé à Abidjan, notre Centre d'Affaires vous offre un environnement de travail professionnel et stimulant à des tarifs compétitifs.</p>
        </div>
        <div className="mt-8">
          <Link href="/contact" className="inline-block rounded bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90">
            Contactez-nous pour en savoir plus →
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
