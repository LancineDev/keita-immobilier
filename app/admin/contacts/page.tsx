"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2, Mail, Phone, User, MessageSquare, Loader2 } from "lucide-react"

type Contact = {
  id?: string
  nom: string
  prenom: string
  email: string
  telephone: string
  sujet: string
  message: string
  createdAt?: any
}

export default function AdminContactsPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/connexion")
  }, [user, isAdmin, loading])

  useEffect(() => {
    setLoadingData(true)
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Contact)))
      setLoadingData(false)
    }, (err) => {
      console.error("snapshot error", err)
      setContacts([])
      setLoadingData(false)
    })
    return () => unsub()
  }, [])

  const handleDelete = async (contact: Contact) => {
    if (!confirm(`Supprimer le message de ${contact.prenom} ${contact.nom} ?`)) return
    await deleteDoc(doc(db, "contacts", contact.id!))
  }

  if (loading || loadingData) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-primary px-6 py-4 text-white shadow">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-1 hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif text-xl font-bold">Messages de Contact</h1>
        </div>
        <Link href="/" className="flex items-center gap-1 rounded border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10">
          <Mail className="h-4 w-4" /> Voir le site
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h2 className="font-serif text-xl font-bold text-foreground">Tous les messages</h2>
          <p className="text-sm text-muted-foreground">Demandes de contact reçues ({contacts.length})</p>
        </div>

        {contacts.length === 0 ? (
          <div className="rounded-xl border border-border bg-white p-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-serif text-lg font-bold text-foreground">Aucun message</h3>
            <p className="text-sm text-muted-foreground">Les messages de contact apparaîtront ici.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="rounded-xl border border-border bg-white p-6 shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-4 flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="font-serif text-lg font-bold text-foreground">
                        {contact.prenom} {contact.nom}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {contact.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                      </span>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.telephone}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="mb-2 font-semibold text-foreground">Sujet: {contact.sujet}</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.message}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(contact)}
                    className="ml-4 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}