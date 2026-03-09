import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary">
                <span className="font-serif text-xl font-bold text-primary-foreground">K</span>
              </div>
              <div className="ml-2">
                <span className="font-serif text-lg font-bold tracking-wide text-background">Keita</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-background/60">
              {"Votre reference en immobilier depuis 1995. Agence immobiliere specialisee en vente, location, syndic et gestion locative en Cote d'Ivoire."}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-accent">
              Liens Rapides
            </h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-background/60 hover:text-accent transition-colors">Accueil</Link></li>
              <li><Link href="/a-propos" className="text-sm text-background/60 hover:text-accent transition-colors">A Propos</Link></li>
              <li><Link href="/location" className="text-sm text-background/60 hover:text-accent transition-colors">Location</Link></li>
              <li><Link href="/vente" className="text-sm text-background/60 hover:text-accent transition-colors">Vente</Link></li>
              <li><Link href="/contact" className="text-sm text-background/60 hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-accent">
              Nos Services
            </h4>
            <ul className="space-y-2">
              <li><Link href="/location" className="text-sm text-background/60 hover:text-accent transition-colors">Location</Link></li>
              <li><Link href="/vente" className="text-sm text-background/60 hover:text-accent transition-colors">Vente</Link></li>
              <li><Link href="/syndic" className="text-sm text-background/60 hover:text-accent transition-colors">Syndic de Copropriete</Link></li>
              <li><Link href="/gestion" className="text-sm text-background/60 hover:text-accent transition-colors">Gestion Locative</Link></li>
              <li><Link href="/conseil-en-immobilier" className="text-sm text-background/60 hover:text-accent transition-colors">Conseil Immobilier</Link></li>
              <li><Link href="/conciergerie" className="text-sm text-background/60 hover:text-accent transition-colors">{"Centre d'Affaires"}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-accent">
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <span className="text-sm text-background/60">{"Cocody, Abidjan, Cote d'Ivoire"}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <span className="text-sm text-background/60">+225 6384695523</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <span className="text-sm text-background/60">contact@keita.ci</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 sm:flex-row">
          <p className="text-xs text-background/40">
            {"Keita Immobilier 2026. Tous droits reserves."}
          </p>
          <div className="flex gap-3">
            <a href="#" className="text-background/40 hover:text-accent transition-colors" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
            <a href="#" className="text-background/40 hover:text-accent transition-colors" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="text-background/40 hover:text-accent transition-colors" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
            <a href="#" className="text-background/40 hover:text-accent transition-colors" aria-label="YouTube"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
