"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import {
  collection, addDoc, deleteDoc,
  doc, updateDoc, serverTimestamp, query, orderBy, onSnapshot, getDocs
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Eye, ArrowLeft, Upload, X, Loader2 } from "lucide-react"

type Property = {
  id?: string
  title: string
  type: "LOCATION" | "VENTE"
  price: string
  ville: string
  quartier: string
  pays: string
  chambres: number
  salles: number
  category: string
  description: string
  features: string
  images: string[]
  loyer?: string
  createdAt?: any
}

const emptyForm: Omit<Property, "id"> = {
  title: "", type: "LOCATION", price: "", ville: "Abidjan",
  quartier: "", pays: "Côte d'Ivoire", chambres: 1, salles: 1,
  category: "", description: "", features: "", images: [], loyer: "",
}

const CLOUD_NAME = "dotcvbkhk"
const UPLOAD_PRESET = "keita_upload"

export default function AdminPropertiesPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 })
  const [saving, setSaving] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/connexion")
  }, [user, isAdmin, loading])

  useEffect(() => {
    setLoadingData(true)
    const q = query(collection(db, "properties"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      setProperties(snap.docs.map(d => ({ id: d.id, ...d.data() } as Property)))
      setLoadingData(false)
    }, (err) => {
      console.error("snapshot error", err)
      setProperties([])
      setLoadingData(false)
    })
    return () => unsub()
  }, [])

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return
    setUploading(true)
    setUploadProgress({ done: 0, total: files.length })

    try {
      const promises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", UPLOAD_PRESET)

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        )
        const data = await res.json()

        if (data.error) throw new Error(data.error.message)

        setUploadProgress(prev => ({ ...prev, done: prev.done + 1 }))
        return data.secure_url as string
      })

      const urls = await Promise.all(promises)
      setForm(f => ({ ...f, images: [...f.images, ...urls] }))

    } catch (e: any) {
      console.error("upload error", e)
      alert("Erreur upload : " + e.message)
    } finally {
      setUploading(false)
      setUploadProgress({ done: 0, total: 0 })
    }
  }

  const removeImage = (index: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    if (!form.title || !form.price) {
      alert("Titre et prix sont obligatoires")
      return
    }
    setSaving(true)
    try {
      // Clone form and remove any undefined fields (especially `id`) before sending to Firestore
      const payload: any = { ...form }
      if (payload.id === undefined) delete payload.id

      if (editing) {
        await updateDoc(doc(db, "properties", editing), payload)
      } else {
        await addDoc(collection(db, "properties"), { ...payload, createdAt: serverTimestamp() })
      }

      setShowForm(false)
      setEditing(null)
      setForm(emptyForm)
    } catch (e) {
      alert("Erreur lors de la sauvegarde: " + (e as any).message)
    }
    setSaving(false)
  }

  const handleEdit = (p: Property) => {
    setEditing(p.id!)
    setForm({ ...p, id: undefined } as any)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const handleDelete = async (p: Property) => {
    if (!confirm(`Supprimer "${p.title}" ?`)) return
    await deleteDoc(doc(db, "properties", p.id!))
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
          <h1 className="font-serif text-xl font-bold">Gestion des Propriétés</h1>
        </div>
        <Link href="/" className="flex items-center gap-1 rounded border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10">
          <Eye className="h-4 w-4" /> Voir le site
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* Formulaire */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-border bg-white p-6 shadow">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground">
                {editing ? "✏️ Modifier la propriété" : "➕ Nouvelle propriété"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm) }}>
                <X className="h-5 w-5 text-muted-foreground hover:text-red-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Titre *</label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Ex: Cocody – Appartement 3 pièces" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Type *</label>
                <select className="w-full rounded border border-border px-3 py-2 text-sm"
                  value={form.type} onChange={e => setForm({...form, type: e.target.value as "LOCATION"|"VENTE"})}>
                  <option value="LOCATION">LOCATION</option>
                  <option value="VENTE">VENTE</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Prix *</label>
                <Input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Ex: 500.000 FCFA" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Loyer mensuel</label>
                <Input value={form.loyer} onChange={e => setForm({...form, loyer: e.target.value})} placeholder="Ex: 500.000 FCFA/par mois" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Catégorie</label>
                <Input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Ex: Appartement 3 Pièces" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Ville</label>
                <Input value={form.ville} onChange={e => setForm({...form, ville: e.target.value})} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Quartier</label>
                <Input value={form.quartier} onChange={e => setForm({...form, quartier: e.target.value})} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Chambres</label>
                <Input type="number" value={form.chambres} onChange={e => setForm({...form, chambres: parseInt(e.target.value) || 0})} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Salles de bain</label>
                <Input type="number" value={form.salles} onChange={e => setForm({...form, salles: parseInt(e.target.value) || 0})} />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  rows={5}
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Description complète de la propriété..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  Les Plus <span className="text-xs text-muted-foreground">(séparés par des virgules)</span>
                </label>
                <Input value={form.features} onChange={e => setForm({...form, features: e.target.value})}
                  placeholder="Ex: cuisine équipée, Meublé, Parking, Piscine" />
              </div>

              {/* Upload Photos */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Photos de la propriété
                  <span className="ml-2 text-xs text-muted-foreground">({form.images.length} photo(s))</span>
                </label>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => e.target.files && handleImageUpload(e.target.files)}
                />

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-8 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                      <span className="font-semibold text-primary">
                        {uploadProgress.done} / {uploadProgress.total} photo(s) téléchargée(s)...
                      </span>
                      <div className="w-56 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-2.5 rounded-full bg-primary transition-all duration-500"
                          style={{
                            width: uploadProgress.total > 0
                              ? `${(uploadProgress.done / uploadProgress.total) * 100}%`
                              : "0%"
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {uploadProgress.total > 0
                          ? `${Math.round((uploadProgress.done / uploadProgress.total) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8" />
                      <span className="font-medium">Cliquez pour ajouter des photos</span>
                      <span className="text-xs text-muted-foreground">JPG, PNG, WEBP — Plusieurs fichiers acceptés</span>
                    </div>
                  )}
                </button>

                {form.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {form.images.map((url, i) => (
                      <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border-2 border-border">
                        <Image src={url} alt="" fill className="object-cover" />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-xs font-bold text-white">
                            ★ Principal
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleSave}
                className="bg-primary text-white hover:bg-primary/90"
                disabled={saving || uploading}
              >
                {saving
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sauvegarde...</>
                  : editing ? "✅ Enregistrer" : "✅ Ajouter la propriété"
                }
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm) }} disabled={saving}>
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Header liste */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">Toutes les propriétés</h2>
            <p className="text-sm text-muted-foreground">{properties.length} annonce(s) au total</p>
          </div>
          {!showForm && (
            <Button
              onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm) }}
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> Ajouter une annonce
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="p-3 text-left font-semibold">Photo</th>
                <th className="p-3 text-left font-semibold">Titre</th>
                <th className="p-3 text-left font-semibold">Type</th>
                <th className="p-3 text-left font-semibold">Prix</th>
                <th className="p-3 text-left font-semibold">Ville</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="font-medium">Aucune propriété pour le moment</p>
                      <p className="text-sm">Cliquez sur &quot;Ajouter une annonce&quot; pour commencer</p>
                    </div>
                  </td>
                </tr>
              ) : properties.map(p => (
                <tr key={p.id} className="border-t border-border hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-border">
                      {p.images?.[0] ? (
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-muted-foreground">No img</div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    <p className="max-w-xs truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold text-white ${p.type === "VENTE" ? "bg-green-600" : "bg-primary"}`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-primary whitespace-nowrap">{p.price}</td>
                  <td className="p-3 text-muted-foreground">{p.ville}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/property/${p.id}`}
                        className="rounded-lg border border-border p-1.5 hover:bg-gray-100 transition-colors" title="Voir">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <button onClick={() => handleEdit(p)}
                        className="rounded-lg border border-border p-1.5 hover:bg-blue-50 transition-colors" title="Modifier">
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </button>
                      <button onClick={() => handleDelete(p)}
                        className="rounded-lg border border-border p-1.5 hover:bg-red-50 transition-colors" title="Supprimer">
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