"use client"
import Image from "next/image"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Phone, Mail } from "lucide-react"
import contactImage from "@/app/assets/contact-us.png"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { notifyAdmin } from "@/lib/notifications"

const pulseStyle: React.CSSProperties = {
  animation: "pulse-scale 4s ease-in-out infinite",
}

export default function ContactPage() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nom || !form.prenom || !form.email || !form.telephone || !form.sujet || !form.message) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }
    setLoading(true)
    try {
      await addDoc(collection(db, "contacts"), {
        ...form,
        createdAt: serverTimestamp()
      })
      try {
        await notifyAdmin(
          "💬 Nouveau Message de Contact",
          `${form.prenom} ${form.nom} - ${form.sujet}`,
          "message-received",
          {
            contactName: `${form.prenom} ${form.nom}`,
            email: form.email,
            telephone: form.telephone,
            sujet: form.sujet,
            subject: form.sujet,
            message: form.message,
            contactMessage: form.message,
          }
        )
      } catch (notificationError) {
        console.error("Failed to send admin notification:", notificationError)
      }
      alert("Message envoyé avec succès !")
      setForm({ nom: "", prenom: "", email: "", telephone: "", sujet: "", message: "" })
    } catch (error) {
      alert("Erreur lors de l'envoi du message")
    }
    setLoading(false)
  }

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
          src={contactImage}
          alt="Contactez notre agence"
          fill
          className="object-cover"
          style={pulseStyle}
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl font-bold text-white drop-shadow-lg">
            Contactez notre agence
          </h1>
        </div>
      </section>

      {/* Section Rendez-nous visite + Map */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">
          Rendez-nous visite
        </h2>
        <div className="overflow-hidden rounded-md border border-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.6!2d-4.016!3d5.356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5311959d63%3A0x26e3f8e7afe24c1!2sKeita%20Immobilier!5e0!3m2!1sfr!2sci!4v1"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation Keita Immobilier"
          />
        </div>
      </section>

      {/* Adresse centrée */}
      <section className="py-6 text-center">
        <div className="flex justify-center">
          <Building2 className="h-10 w-10 text-foreground" />
        </div>
        <p className="mt-3 font-bold text-foreground">KEITA IMMOBILIER</p>
        <p className="text-sm text-muted-foreground">
          Boulevard Valéry Giscard d&apos;Estaing (VGE), Abidjan
        </p>
        <p className="text-sm text-muted-foreground">
          +225 27 21 35 25 47 / +225 01 72 15 15 15
        </p>
      </section>

      {/* Deux colonnes : Info contact (rouge) + Formulaire */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-1 overflow-hidden rounded-md border border-border lg:grid-cols-2">

          {/* Colonne gauche — fond rouge */}
          <div className="bg-primary p-8 text-white">
            <h2 className="mb-8 font-serif text-2xl font-bold">
              Information de Contact
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Building2 className="mt-1 h-5 w-5 flex-shrink-0" />
                <p className="font-semibold">KEITA IMMOBILIER</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  Boulevard Valéry Giscard d&apos;Estaing (VGE), Abidjan
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="text-sm">+225 27 21 35 25 47</p>
                  <p className="text-sm">+225 27 21 35 25 48</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 flex-shrink-0" />
                <p className="text-sm">info@keitaimmobilier.com</p>
              </div>
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <div className="bg-background p-8">
            <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">
              Contactez l&apos;Agence
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Nom *</label>
                  <Input
                    value={form.nom}
                    onChange={e => setForm({...form, nom: e.target.value})}
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Prénom *</label>
                  <Input
                    value={form.prenom}
                    onChange={e => setForm({...form, prenom: e.target.value})}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Email *</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Téléphone *</label>
                  <Input
                    type="tel"
                    value={form.telephone}
                    onChange={e => setForm({...form, telephone: e.target.value})}
                    placeholder="+225 XX XX XX XX XX"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Sujet *</label>
                <Input
                  value={form.sujet}
                  onChange={e => setForm({...form, sujet: e.target.value})}
                  placeholder="Objet de votre message"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Message *</label>
                <Textarea
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Votre message..."
                  rows={5}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}