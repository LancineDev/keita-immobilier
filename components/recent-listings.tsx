"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore"

interface Property {
  id: string
  title: string
  price: string
  chambres: number
  salles: number
  category: string
  images: string[]
}

export function RecentListings() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, "properties"),
      orderBy("createdAt", "desc"),
      limit(4)
    )
    const unsub = onSnapshot(q, snap => {
      const props = snap.docs.map(d => ({ id: d.id, ...d.data() } as Property))
      setProperties(props)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-12">Dernières annonces</h2>
        
        <div className="space-y-6">
          {properties.map(p => (
            <Link key={p.id} href={`/property/${p.id}`} className="flex gap-4 overflow-hidden rounded-md border border-border bg-white hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-auto w-48 flex-shrink-0 overflow-hidden">
                {p.images && p.images.length > 0 ? (
                  <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">No image</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">{p.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-3">{p.price}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.chambres} Ch • {p.salles} Salle(s) de bain(s) • {p.category}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {properties.length === 0 && !loading && (
          <div className="text-center text-muted-foreground py-12">
            Aucune annonce pour le moment
          </div>
        )}
      </div>
    </section>
  )
}
