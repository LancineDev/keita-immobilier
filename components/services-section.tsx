import { Home, Key, Building2, ClipboardCheck, Handshake, Landmark } from "lucide-react"

const services = [
  {
    icon: Key,
    title: "Location",
    description: "Nous vous accompagnons dans la recherche de votre bien en location, avec un large choix de proprietes adaptees a vos besoins et votre budget.",
  },
  {
    icon: Home,
    title: "Vente",
    description: "Beneficiez de notre expertise pour vendre ou acheter un bien immobilier dans les meilleures conditions du marche.",
  },
  {
    icon: Building2,
    title: "Syndic de Copropriete",
    description: "Gestion professionnelle et rigoureuse de vos coproprietes, avec transparence et efficacite pour tous les coproprietaires.",
  },
  {
    icon: ClipboardCheck,
    title: "Gestion Locative",
    description: "Confiez-nous la gestion de votre patrimoine immobilier. Nous assurons un suivi complet de vos biens en location.",
  },
  {
    icon: Handshake,
    title: "Conseil Immobilier",
    description: "Nos experts vous guident dans tous vos projets immobiliers avec des conseils personnalises et adaptes a vos objectifs.",
  },
  {
    icon: Landmark,
    title: "Centre d'Affaires",
    description: "Location de bureaux equipes, espaces de coworking et salles de reunion au coeur d'Abidjan, pour les professionnels exigeants.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-secondary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground lg:text-4xl">
            Nos Services
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {"Depuis 1995, Keita propose un large eventail de services immobiliers professionnels pour repondre a tous vos besoins."}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group cursor-pointer rounded-md bg-background p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-border"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary">
                <service.icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
              </div>
              <h3 className="mb-3 font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
