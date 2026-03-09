"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Trash2, Shield, ShieldOff, Loader2 } from "lucide-react"

type UserData = {
  uid: string
  email: string
  displayName: string
  isAdmin: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/login")
  }, [user, isAdmin, loading])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoadingData(true)
    try {
      const snap = await getDocs(collection(db, "users"))
      setUsers(snap.docs.map(d => ({ uid: d.id, ...(d.data() as any) }) as UserData))
    } catch {
      setUsers([])
    }
    setLoadingData(false)
  }

  const handleDelete = async (uid: string, email: string) => {
    if (email === "knktech@keita.ci") {
      alert("Impossible de supprimer le compte admin")
      return
    }
    if (!confirm("Supprimer cet utilisateur ?")) return
    await deleteDoc(doc(db, "users", uid))
    await fetchUsers()
  }

  const toggleAdmin = async (u: UserData) => {
    if (u.email === "knktech@keita.ci") {
      alert("Impossible de modifier le statut du compte principal")
      return
    }
    await updateDoc(doc(db, "users", u.uid), { isAdmin: !u.isAdmin })
    await fetchUsers()
  }

  if (loading || loadingData) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-primary px-6 py-4 text-white shadow">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif text-xl font-bold">Gestion des Utilisateurs</h1>
        </div>
        <Link href="/" className="flex items-center gap-1 rounded border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10">
          <Eye className="h-4 w-4" /> Voir le site
        </Link>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6">
          <h2 className="font-serif text-xl font-bold text-foreground">Tous les utilisateurs</h2>
          <p className="text-sm text-muted-foreground">{users.length} compte(s) inscrit(s)</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-white shadow">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="p-3 text-left font-semibold">Nom</th>
                <th className="p-3 text-left font-semibold">Email</th>
                <th className="p-3 text-left font-semibold">Inscrit le</th>
                <th className="p-3 text-center font-semibold">Rôle</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">Aucun utilisateur inscrit.</td>
                </tr>
              ) : users.map(u => (
                <tr key={u.uid} className="border-t border-border hover:bg-gray-50">
                  <td className="p-3 font-medium text-foreground">{u.displayName}</td>
                  <td className="p-3 text-muted-foreground">{u.email}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold text-white ${u.isAdmin ? "bg-primary" : "bg-gray-400"}`}>
                      {u.isAdmin ? "Admin" : "Utilisateur"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => toggleAdmin(u)} title={u.isAdmin ? "Retirer admin" : "Rendre admin"}
                        className="rounded border border-border p-1.5 hover:bg-secondary">
                        {u.isAdmin ? <ShieldOff className="h-4 w-4 text-orange-500" /> : <Shield className="h-4 w-4 text-green-500" />}
                      </button>
                      <button onClick={() => handleDelete(u.uid, u.email)}
                        className="rounded border border-border p-1.5 hover:bg-secondary">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
