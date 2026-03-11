"use client"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

const defaultProperties = [
  {
    title: "Koumassi – Appartement 4 pièces",
    type: "LOCATION",
    price: "250.000 FCFA",
    ville: "Abidjan",
    quartier: "Koumassi",
    pays: "Côte d'Ivoire",
    chambres: 3,
    salles: 2,
    category: "Appartement 4 Pièces",
    description: "Bel appartement de 4 pièces idéalement situé à Koumassi. Bien entretenu, lumineux et fonctionnel, parfait pour une famille.",
    features: "Meublé, Parking",
    images: ["/images/location-agent.svg"],
    loyer: "250.000 FCFA"
  },
  {
    title: "Riviera Palmeraie – Villa Duplex 5 pièces",
    type: "LOCATION",
    price: "750.000 FCFA",
    ville: "Abidjan",
    quartier: "Riviera Palmeraie",
    pays: "Côte d'Ivoire",
    chambres: 4,
    salles: 4,
    category: "Villa Duplex 5 Pièces",
    description: "Magnifique villa duplex de 5 pièces à la Riviera Palmeraie. Résidence sécurisée avec piscine, parking et espaces verts.",
    features: "Piscine, Parking, Gardiennage",
    images: ["/images/vente-couple.jpg"],
    loyer: "750.000 FCFA"
  },
  {
    title: "Marcory Zone 4 – Villa basse 4 pièces",
    type: "LOCATION",
    price: "1.500.000 FCFA",
    ville: "Abidjan",
    quartier: "Marcory Zone 4",
    pays: "Côte d'Ivoire",
    chambres: 3,
    salles: 3,
    category: "Villa Basse 4 Pièces",
    description: "Villa basse de 4 pièces en zone résidentielle de Marcory. Cadre calme et sécurisé, avec jardin privatif et parking.",
    features: "Jardin, Parking",
    images: ["/images/gestion-hero.jpg"],
    loyer: "1.500.000 FCFA"
  },
  {
    title: "Grand Bassam – Villas basses 4 pièces",
    type: "LOCATION",
    price: "1.000.000 FCFA",
    ville: "Grand - Bassam",
    quartier: "Grand Bassam",
    pays: "Côte d'Ivoire",
    chambres: 3,
    salles: 2,
    category: "Villa Basse 4 Pièces",
    description: "Villas basses de 4 pièces situées à Grand Bassam, à proximité de la plage. Idéales pour une résidence secondaire.",
    features: "Vue mer, Parking",
    images: ["/images/location-hero.svg"],
    loyer: "1.000.000 FCFA"
  },
  {
    title: "Cocody – Appartement 2 Pièces",
    type: "LOCATION",
    price: "700.000 FCFA",
    ville: "Abidjan",
    quartier: "Cocody",
    pays: "Côte d'Ivoire",
    chambres: 1,
    salles: 1,
    category: "Appartement 2 Pièces",
    description: "Appartement 2 pièces moderne et lumineux situé à Cocody. Proche de toutes commodités, transports et commerces.",
    features: "Meublé, Climatisé",
    images: ["/images/syndic-hero.jpg"],
    loyer: "700.000 FCFA"
  },
  {
    title: "Marcory résidentiel – Appartement 4 pièces",
    type: "LOCATION",
    price: "500.000 FCFA",
    ville: "Abidjan",
    quartier: "Marcory Résidentiel",
    pays: "Côte d'Ivoire",
    chambres: 3,
    salles: 2,
    category: "Appartement 4 Pièces",
    description: "Appartement 4 pièces dans la zone résidentielle de Marcory. Environnement calme et sécurisé, idéal pour une famille.",
    features: "Parking",
    images: ["/images/conciergerie-hero.svg"],
    loyer: "500.000 FCFA"
  },
  {
    title: "RIVIERA M'BADON – VILLA TRIPLEX 13 Pièces",
    type: "VENTE",
    price: "800.000.000 FCFA",
    ville: "Abidjan",
    quartier: "Riviera M'Badon",
    pays: "Côte d'Ivoire",
    chambres: 10,
    salles: 8,
    category: "Villa triplex 13 pièces",
    description: "Exceptionnelle villa triplex de 13 pièces à la Riviera M'Badon. Propriété de très haut standing avec finitions luxueuses.",
    features: "Piscine, Salle de sport, Gardiennage, Parking",
    images: ["/images/conseil-hero.svg"],
  },
  {
    title: "Adzopé – Entrepôts & Bureaux",
    type: "LOCATION",
    price: "1.500.000 FCFA",
    ville: "Adzopé",
    quartier: "Adzopé",
    pays: "Côte d'Ivoire",
    chambres: 0,
    salles: 0,
    category: "Local commercial",
    description: "Entrepôts et bureaux de 1700 m² disponibles à Adzopé. Idéal pour activités industrielles ou commerciales.",
    features: "Grande superficie, Accès poids lourds",
    images: ["/images/vente-search.svg"],
    loyer: "1.500.000 FCFA"
  },
  {
    title: "Angré – Villa Duplex 8 Pièces",
    type: "LOCATION",
    price: "1.700.000 FCFA",
    ville: "Abidjan",
    quartier: "Angré",
    pays: "Côte d'Ivoire",
    chambres: 6,
    salles: 6,
    category: "Villa Duplex 8 Pièces",
    description: "Grande villa duplex de 8 pièces à Angré. Résidence haut standing avec piscine, jardin paysager et système de sécurité.",
    features: "Piscine, Jardin, Gardiennage, Parking",
    images: ["/images/hero-bg.jpg"],
    loyer: "1.700.000 FCFA"
  },
  {
    title: "Bingerville – Villas Duplex 6 pièces",
    type: "LOCATION",
    price: "1.000.000 FCFA",
    ville: "Abidjan",
    quartier: "Bingerville",
    pays: "Côte d'Ivoire",
    chambres: 4,
    salles: 4,
    category: "Villa Duplex 6 Pièces",
    description: "Villas duplex de 6 pièces à Bingerville dans un cadre verdoyant. Résidence calme et sécurisée.",
    features: "Jardin, Parking, Piscine",
    images: ["/images/location-keys.svg"],
    loyer: "1.000.000 FCFA"
  }
]

export default function AddDefaultPropertiesPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState("")

  if (loading) return <div>Loading...</div>
  if (!user || !isAdmin) {
    router.push("/login")
    return null
  }

  const handleAddProperties = async () => {
    setIsAdding(true)
    setMessage("")

    try {
      console.log("Adding default properties...")
      for (const property of defaultProperties) {
        await addDoc(collection(db, "properties"), {
          ...property,
          createdAt: serverTimestamp()
        })
        console.log(`Added: ${property.title}`)
      }
      setMessage("✅ 10 default properties added successfully!")
    } catch (error) {
      console.error("Error:", error)
      setMessage("❌ Error adding properties: " + (error as Error).message)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">Add Default Properties</h1>

        <div className="rounded-lg border bg-white p-6 shadow">
          <p className="mb-4 text-gray-600">
            This will add 10 default properties to your database. These are the same properties that were previously hardcoded in the frontend.
          </p>

          <Button
            onClick={handleAddProperties}
            disabled={isAdding}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isAdding ? "Adding Properties..." : "Add Default Properties"}
          </Button>

          {message && (
            <div className="mt-4 rounded border p-3 text-sm">
              {message}
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button
            onClick={() => router.push("/admin/properties")}
            variant="outline"
          >
            Back to Properties Admin
          </Button>
        </div>
      </div>
    </div>
  )
}