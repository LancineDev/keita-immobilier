import Image from "next/image"

export function AboutSection() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 font-serif text-3xl font-bold text-primary lg:text-4xl">
              Notre agence
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
              <p>
                {"Creee en 1995, et comptant parmi les leaders du marche immobilier en Cote d'Ivoire, KEITA est une Agence immobiliere, specialisee dans la realisation de transactions commerciales et de services en immobilier (Locations, Ventes, Acquisitions, Gestion de patrimoines, Conciergerie immobiliere, Syndic de Coproprietes et Conseil en Immobilier)."}
              </p>
              <p>
                {"Titulaire d'un agrement ministeriel et membre du reseau professionnel CDAIM (Chambre du Droit des Affaires et de l'Immobilier), KEITA a construit sa notoriete grace a son expertise reconnue du marche immobilier ivoirien, la qualite et la diversite de ses prestations et sa gestion rigoureuse, efficace et professionnelle des biens immobiliers qui lui sont confies."}
              </p>
            </div>
          </div>
          <div className="relative h-80 overflow-hidden rounded-md shadow-lg lg:h-96">
            <Image
              src="/images/building.jpg"
              alt="Immeuble KEITA"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-secondary p-8">
            <h3 className="mb-4 font-serif text-xl font-bold text-primary">Notre Implantation</h3>
            <p className="text-sm leading-relaxed text-foreground/80">
              {"Dotee d'une equipe dynamique et professionnelle, l'Agence Immobiliere KEITA couvre l'ensemble des communes de la capitale economique, ou elle beneficie d'une forte visibilite."}
            </p>
          </div>
          <div className="rounded-md border border-border bg-secondary p-8">
            <h3 className="mb-4 font-serif text-xl font-bold text-primary">{"Notre activite de Centre d'Affaires"}</h3>
            <p className="text-sm leading-relaxed text-foreground/80">
              {"Attentive aux evolutions du marche immobilier, et soucieuse de satisfaire aux besoins specifiques de sa clientele de professionnels, KEITA a developpe depuis Mars 2015 une activite de centre d'affaires (KCA) qui propose la location temporaire de bureaux, d'espaces de travail partage (coworking) et de salles de reunion entierement meubles et equipes."}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
