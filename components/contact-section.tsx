import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactSection() {
  return (
    <section id="contact" className="bg-primary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center font-serif text-3xl font-bold text-primary-foreground lg:text-4xl">
          Contactez-nous
        </h2>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-primary-foreground">Adresse</h4>
                <p className="text-sm text-primary-foreground/70">
                  {"Abidjan, Cote d'Ivoire"}
                  <br />
                  {"Cocody, Rue des Jardins"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                <Phone className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-primary-foreground">{"Telephone"}</h4>
                <p className="text-sm text-primary-foreground/70">
                  +225 6384695523
                  <br />
                  +225 6384695523
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-primary-foreground">Email</h4>
                <p className="text-sm text-primary-foreground/70">
                  contact@keita.ci
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-primary-foreground">Horaires</h4>
                <p className="text-sm text-primary-foreground/70">
                  Lundi - Vendredi : 08h00 - 18h00
                  <br />
                  Samedi : 09h00 - 13h00
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact form */}
          <form className="space-y-4 rounded-md bg-primary-foreground/10 p-6 backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input placeholder="Nom" className="h-11 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
              <Input placeholder="Prenom" className="h-11 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
            </div>
            <Input placeholder="Email" type="email" className="h-11 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
            <Input placeholder="Telephone" type="tel" className="h-11 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
            <Textarea placeholder="Votre message..." rows={4} className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
            <Button className="w-full bg-accent text-foreground hover:bg-accent/90 font-semibold h-11">
              Envoyer
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
