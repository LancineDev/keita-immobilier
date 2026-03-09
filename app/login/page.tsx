"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useAuth } from "@/contexts/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const ADMIN_EMAIL = "knktech@keita.ci"

export default function ConnexionPage() {
  const { loginWithGoogle } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async () => {
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

  const handleGoogle = async () => {
    setError("")
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      router.push("/")
    } catch (e: any) {
      setError("Erreur Google : " + e.message)
    }
    setGoogleLoading(false)
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-secondary py-12 px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-background p-8 shadow-lg">

          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
              <span className="font-serif text-2xl font-bold text-white">K</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary">KEITA IMMOBILIER</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connectez-vous à votre espace client
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* Bouton Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="mb-5 flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>{googleLoading ? "Connexion..." : "Continuer avec Google"}</span>
          </button>

          {/* Séparateur */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">ou avec votre email</span>
            </div>
          </div>

          {/* Formulaire */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Email ou identifiant
              </label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                suppressHydrationWarning
              />
            </div>

            <Button
              className="w-full bg-primary text-white hover:bg-primary/90"
              onClick={handleSubmit}
              disabled={loading}
              suppressHydrationWarning
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Connexion en cours...
                </span>
              ) : "Se connecter"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Mot de passe oublié ?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contactez-nous.
              </Link>
            </p>
          </div>

          {/* Footer links */}
          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                S&apos;inscrire gratuitement
              </Link>
            </p>
            <Link href="/" className="block text-sm text-muted-foreground hover:underline">
              ← Retour au site
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
