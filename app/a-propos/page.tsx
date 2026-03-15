import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "A Propos - Keita Immobilier",
  description: "Découvrez KEITA, agence immobilière de référence en Côte d'Ivoire depuis 1994.",
}

const pulseStyle: React.CSSProperties = {
  animation: "pulse-scale 4s ease-in-out infinite",
}

export default function AProposPage() {
  return (
    <main className="min-h-screen">
      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
      `}</style>

      <Header />

      {/* Hero Banner */}
      <section className="relative h-64 w-full overflow-hidden">
        <Image
          src="/images/me.jpeg"
          alt="A propos de KEITA"
          fill
          className="object-cover"
          style={pulseStyle}
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl font-bold text-white drop-shadow-lg">
            A propos
          </h1>
        </div>
      </section>

      {/* Notre agence : image gauche, texte droite */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 font-serif text-2xl font-bold text-foreground">
          Notre agence
        </h2>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          {/* Image gauche */}
          <div className="relative h-72 w-full overflow-hidden rounded-md lg:h-80">
            <Image
              src="/images/me.jpeg"
              alt="Siège Keita Immobilier"
              fill
              className="object-cover"
              style={pulseStyle}
            />
          </div>

          {/* Texte droite */}
          <div>
            <p className="mb-4 text-base leading-relaxed text-foreground">
              {"Créée en 1994, et comptant parmi les leaders du marché immobilier en Côte d'Ivoire, KEITA est une Agence immobilière agréée, spécialisée dans la réalisation de transactions commerciales et de services en immobilier (Locations, Ventes, Acquisitions, Gestion locative, Syndic de copropriétés, Conciergerie immobilière et Conseil en Immobilier)."}
            </p>
            <p className="mb-6 text-base leading-relaxed text-foreground">
              {"Titulaire d'un agrément ministériel et membre du réseau professionnel CDAIM (Chambre du Droit des Affaires et de l'Immobilier), l'Agence immobilière KEITA a construit sa notoriété auprès du public grâce à son expertise pointue et reconnue, sa gestion rigoureuse, professionnelle et transparente (des patrimoines confiés) et la qualité de ses prestations."}
            </p>
            <p className="mb-6 text-base font-semibold text-foreground">
              Nos objectifs : Gérer, Valoriser, Sécuriser et Optimiser votre patrimoine immobilier
            </p>
            <div className="flex items-center justify-start">
              <div className="rounded border-2 border-primary px-4 py-3 text-center">
                <p className="text-xs font-bold uppercase leading-tight text-primary">
                  AGENT<br />IMMOBILIER<br />AGRÉÉ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIRECTEUR */}
      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 font-serif text-2xl font-bold text-foreground text-center">
            Notre Équipe de Direction
          </h2>
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="relative h-64 w-52 overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/images/me.jpeg"
                  alt="Directeur Keita Immobilier"
                  fill
                  className="object-cover object-top"
                  style={pulseStyle}
                />
              </div>
            </div>

            {/* Texte */}
            <div className="flex flex-col justify-center">
              <h3 className="mb-1 font-serif text-xl font-bold text-foreground">
                M. Keita
              </h3>
              <p className="mb-4 text-sm font-semibold text-primary uppercase tracking-wide">
                Directeur Général — Fondateur
              </p>
              <p className="text-base leading-relaxed text-foreground">
                {"Fort de plus de 30 ans d'expérience dans l'immobilier en Côte d'Ivoire, M. Keita a fondé l'agence en 1994 avec une vision claire : offrir des services immobiliers de qualité, transparents et accessibles à tous. Sous sa direction, KEITA est devenue une référence incontournable du marché immobilier abidjanais."}
              </p>
              <div className="mt-4 flex gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  +30 ans d&apos;expérience
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Agent Agréé CDAIM
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Implantation */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
          Notre Implantation
        </h2>
        <p className="mb-8 text-base leading-relaxed text-foreground">
          {"Dotée d'une équipe de 30 collaborateurs expérimentés, dynamiques et passionnés par l'immobilier, l'Agence Immobilière KEITA couvre l'ensemble des communes de la capitale économique (ABIDJAN), où elle bénéficie d'une bonne implantation et d'une forte visibilité."}
        </p>
        <div className="mx-auto max-w-lg overflow-hidden rounded-md border border-border">
          <Image
            src="/images/OIP.jpg"
            alt="Les dix communes d'Abidjan"
            width={600}
            height={450}
            className="w-full object-cover"
            style={pulseStyle}
          />
        </div>
      </section>

      {/* Centre d'Affaires */}
      <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
        <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
          Notre activité de Centre d&apos;Affaires
        </h2>
        <p className="mb-4 text-base leading-relaxed text-foreground">
          {"Attentive aux évolutions du marché immobilier en Côte d'Ivoire, et soucieuse de satisfaire aux besoins spécifiques de sa clientèle professionnelle, l'agence immobilière KEITA gère depuis 2015 une activité de Centre d'Affaires, qui propose des solutions de bureaux flexibles clés en main (privés ou partagés), la location de salles de réunion (meublées et équipées) et la domiciliation professionnelle à des tarifs avantageux."}
        </p>
        <p className="mb-8 text-base font-semibold text-foreground">
          Contactez-nous pour en savoir plus !
        </p>
        <div className="mx-auto flex max-w-xs items-center justify-center overflow-hidden rounded-md border border-border">
          <div className="flex w-full items-center bg-[#1a3a2a]">
            <div className="bg-white p-4">
              <div className="h-10 w-10 rounded-full bg-[#c0622a]" />
            </div>
            <div className="px-4 text-left">
              <p className="font-bold text-white text-xl">nomad</p>
              <p className="text-xs text-white/80 italic">Centre d&apos;affaires</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="mb-8 font-serif text-2xl font-bold text-foreground">
          Contactez l&apos;Agence
        </h2>
        <form className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nom *</label>
              <Input placeholder="" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Prénom *</label>
              <Input placeholder="" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Email *</label>
              <Input type="email" placeholder="" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Téléphone *</label>
              <Input type="tel" placeholder="" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Sujet *</label>
            <Input placeholder="" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Message *</label>
            <Textarea rows={6} placeholder="" />
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" id="consent" className="mt-1 h-4 w-4" />
            <label htmlFor="consent" className="text-xs text-muted-foreground">
              En créant ma fiche « CONTACTEZ L&apos;AGENCE », je reconnais expressément que je consens au traitement de mes données personnelles et que je dispose du droit de retirer mon consentement à tout moment en m&apos;adressant à info@aivoni.com.
            </label>
          </div>
          <Button type="submit" className="bg-foreground text-background hover:bg-foreground/80">
            Envoyer
          </Button>
        </form>
      </section>

      <Footer />
    </main>
  )
}