"use client"
import { createContext, useContext, useEffect, useState } from "react"
import {
  User, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, updateProfile,
  GoogleAuthProvider, signInWithPopup
} from "firebase/auth"
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

const ADMIN_EMAIL = "keitaimmobilier@gmail.com"

type UserData = {
  uid: string
  email: string
  displayName: string
  isAdmin: boolean
  createdAt: string
  photoURL?: string
}

type AuthContextType = {
  user: User | null
  userData: UserData | null
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

// Helper function to send admin notification
const notifyAdminOfNewUser = async (userName: string, userEmail: string) => {
  try {
    const adminSnap = await getDocs(
      query(collection(db, "users"), where("email", "==", ADMIN_EMAIL))
    )

    if (adminSnap.empty) return

    const adminId = adminSnap.docs[0].id
    await setDoc(
      doc(db, "notifications", `${Date.now()}`),
      {
        userId: adminId,
        title: "👤 Nouvel Utilisateur Inscrit",
        message: `${userName} (${userEmail}) vient de s'inscrire`,
        type: "user-registered",
        data: { userName, userEmail },
        read: false,
        createdAt: new Date(),
      }
    )
  } catch (error) {
    console.error("Error notifying admin of new user:", error)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          let data = docSnap.data() as UserData
          if (typeof data.isAdmin === "undefined") {
            const isAdminFlag = (firebaseUser.email || "") === ADMIN_EMAIL
            await setDoc(docRef, { ...data, isAdmin: isAdminFlag }, { merge: true })
            data = { ...data, isAdmin: isAdminFlag }
          }
          setUserData(data)
        } else {
          const newUser: UserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "Utilisateur",
            isAdmin: (firebaseUser.email || "") === ADMIN_EMAIL,
            createdAt: new Date().toISOString(),
            photoURL: firebaseUser.photoURL || "",
          }
          await setDoc(docRef, newUser)
          setUserData(newUser)
        }
      } else {
        setUserData(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    const firebaseUser = cred.user

    // Vérifier si l'utilisateur existe déjà dans Firestore
    const docRef = doc(db, "users", firebaseUser.uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      // Créer le profil si c'est la première connexion Google
      const newUser: UserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || "Utilisateur",
        isAdmin: firebaseUser.email === ADMIN_EMAIL,
        createdAt: new Date().toISOString(),
        photoURL: firebaseUser.photoURL || "",
      }
      await setDoc(docRef, newUser)
      setUserData(newUser)
      
      // Notify admin of new user registration
      await notifyAdminOfNewUser(newUser.displayName, newUser.email)
    } else {
      setUserData(docSnap.data() as UserData)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    const newUser: UserData = {
      uid: cred.user.uid,
      email,
      displayName: name,
      isAdmin: email === ADMIN_EMAIL,
      createdAt: new Date().toISOString(),
    }
    await setDoc(doc(db, "users", cred.user.uid), newUser)
    setUserData(newUser)
    
    // Notify admin of new user registration
    await notifyAdminOfNewUser(name, email)
  }

  const logout = async () => {
    await signOut(auth)
    setUserData(null)
  }

  const isAdmin = userData?.isAdmin || user?.email === ADMIN_EMAIL

  return (
    <AuthContext.Provider value={{
      user, userData, isAdmin: !!isAdmin,
      loading, login, loginWithGoogle, register, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
