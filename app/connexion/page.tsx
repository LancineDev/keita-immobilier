"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Header } from "@/components/header"
import { InnerPageLayout } from "@/components/inner-page-layout"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Lock } from "lucide-react"

const ADMIN_EMAIL = "knktech@keita.ci"

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      return
    }
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      
      const isAdminByEmail = cred.user.email === ADMIN_EMAIL

      let isAdminByDB = false
      try {
        const docSnap = await getDoc(doc(db, "users", cred.user.uid))
        if (docSnap.exists()) {
          isAdminByDB = docSnap.data().isAdmin === true
        }
      } catch {}

      if (isAdminByEmail || isAdminByDB) {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (e: any) {
      if (
        e.code === "auth/user-not-found" ||
        e.code === "auth/wrong-password" ||
        e.code === "auth/invalid-credential"
      ) {
        setError("Email ou mot de passe incorrect")
      } else if (e.code === "auth/too-many-requests") {
        setError("Trop de tentatives. Réessayez plus tard.")
      } else {
        setError("Erreur : " + e.message)
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen">
      <Header />
      <InnerPageLayout
        breadcrumbs={[{ label: "Connexion" }]}
        title="Connexion"
      >
        <div className="mx-auto max-w-md">
          <div className="rounded-md border border-border bg-background p-6">
            <p className="mb-6 text-sm text-muted-foreground">
              {"Connectez-vous a votre espace client pour acceder a vos biens, vos documents et vos favoris."}
            </p>
            {error && (
              <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                ⚠️ {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Email ou identifiant
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="votre@email.com"
                    className="border-border pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Votre mot de passe"
                    className="border-border pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {"Mot de passe oublie ? Contactez-nous."}
              </p>
            </form>
          </div>
        </div>
      </InnerPageLayout>
      <Footer />
    </main>
  )
}
