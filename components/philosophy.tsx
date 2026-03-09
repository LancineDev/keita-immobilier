import Image from "next/image"
import { Award, BarChart3, Shield, Users, Briefcase, Network } from "lucide-react"

export function Philosophy() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Photo + name */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6 h-72 w-72 overflow-hidden rounded-full border-4 border-accent shadow-lg lg:h-80 lg:w-80">
              <Image
                src="/images/manager.jpg"
                alt="Nelly ABOBI - Gerante Keita"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">Nelly ABOBI</h3>
            <p className="text-sm text-accent">{"Gerante Keita"}</p>
          </div>

          {/* Philosophy text */}
          <div>
            <h2 className="mb-6 font-serif text-3xl font-bold text-primary lg:text-4xl">
              Notre philosophie
            </h2>
            <blockquote className="mb-6 border-l-4 border-accent pl-4 italic text-muted-foreground">
              {"\"L'immobilier est le placement le plus sur au monde\" disait Franklin Roosevelt."}
            </blockquote>
            <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
              <p>
                {"Cela est parfaitement juste. Mais l'immobilier est aussi un secteur complexe qui peut s'apparenter a un veritable parcours du combattant si vous n'y etes pas bien prepares."}
              </p>
              <p>
                {"A Keita, nous placons l'humain au coeur de nos priorites depuis 30 ans."}
              </p>
              <p>
                {"Et parce que nous pensons que vous etes uniques et que vos projets de vie le sont aussi, nous vous proposons un large eventail de services immobiliers professionnels et de qualite pour repondre a tous vos besoins en immobilier, vous conseiller utilement et vous accompagner avec efficacite, rigueur, disponibilite et reactivite."}
              </p>
              <p className="font-semibold text-primary">
                {"Soyez donc les bienvenu(e)s a Keita, Vous etes chez Vous !"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const features = [
  {
    icon: Award,
    title: "Une expertise professionnelle reconnue depuis 30 ans",
  },
  {
    icon: BarChart3,
    title: "Des estimations commerciales aux prix les plus justes",
  },
  {
    icon: Shield,
    title: "Des transactions transparentes, sures et securisees",
  },
  {
    icon: Users,
    title: "Une equipe qualifiee, experimentee et dynamique",
  },
  {
    icon: Briefcase,
    title: "Des services de qualite, diversifies et personnalises",
  },
  {
    icon: Network,
    title: "Un vaste reseau professionnel solide et efficace",
  },
]

export function Features() {
  return (
    <section className="bg-primary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center font-serif text-3xl font-bold text-primary-foreground lg:text-4xl text-balance">
          {"Votre reference en immobilier depuis 1995"}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col items-center rounded-md bg-primary-foreground/10 p-8 text-center transition-all hover:bg-primary-foreground/20"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                <feature.icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-sm font-semibold leading-relaxed text-primary-foreground">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
