"use client"
import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Building2, Users, Eye, LogOut, Home, Settings } from "lucide-react"

export default function AdminPage() {
  const { user, isAdmin, logout, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login")
    }
  }, [user, isAdmin, loading])

  if (loading) return <div className="flex min-h-screen items-center justify-center"><p>Chargement...</p></div>
  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-primary px-6 py-4 text-white shadow">
        <div className="flex items-center gap-3">
          <Home className="h-6 w-6" />
          <div>
            <h1 className="font-serif text-xl font-bold">KALIMBA IMMOBILIER</h1>
            <p className="text-xs opacity-80">Dashboard Admin — knktech</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 rounded border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10">
            <Eye className="h-4 w-4" /> Voir le site
          </Link>
          <button onClick={() => { logout(); router.push("/login") }}
            className="flex items-center gap-1 rounded border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="mb-8 font-serif text-2xl font-bold text-foreground">Bienvenue, Admin 👋</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/properties"
            className="group flex items-center gap-5 rounded-xl border border-border bg-white p-6 shadow hover:border-primary hover:shadow-md transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">Propriétés</h3>
              <p className="text-sm text-muted-foreground">Ajouter, modifier, supprimer des annonces</p>
            </div>
          </Link>

          <Link href="/admin/contacts"
            className="group flex items-center gap-5 rounded-xl border border-border bg-white p-6 shadow hover:border-orange-500 hover:shadow-md transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 group-hover:bg-orange-100">
              <Users className="h-7 w-7 text-orange-500" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">Messages de contact</h3>
              <p className="text-sm text-muted-foreground">Voir les demandes de contact</p>
            </div>
          </Link>

          <Link href="/admin/users"
            className="group flex items-center gap-5 rounded-xl border border-border bg-white p-6 shadow hover:border-primary hover:shadow-md transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 group-hover:bg-blue-100">
              <Users className="h-7 w-7 text-blue-500" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">Utilisateurs</h3>
              <p className="text-sm text-muted-foreground">Gérer les comptes inscrits</p>
            </div>
          </Link>

          <Link href="/admin/add-default-properties"
            className="group flex items-center gap-5 rounded-xl border border-border bg-white p-6 shadow hover:border-green-500 hover:shadow-md transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 group-hover:bg-green-100">
              <Settings className="h-7 w-7 text-green-500" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">Propriétés par défaut</h3>
              <p className="text-sm text-muted-foreground">Ajouter les propriétés d'exemple</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
