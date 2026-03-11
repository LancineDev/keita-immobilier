"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal, Phone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const propertyTypes = [
  "Appartement", "Maison", "Terrain", "Local commercial", "Parking",
  "Bureau", "Villa Basse", "Villa Duplex", "Studio", "Immeuble"
]

const bedrooms = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

const tabs = [
  { id: "tout", label: "Tout" },
  { id: "acheter", label: "Acheter" },
  { id: "louer", label: "Louer" },
]

export function HeroSearch() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("tout")
  const [city, setCity] = useState("")
  const [bedrooms_count, setBedrooms] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [budget, setBudget] = useState("")
  const [isClient, setIsClient] = useState(false)

  // Ensure component only renders after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (activeTab !== "tout") params.append("type", activeTab)
    if (city) params.append("city", city)
    if (bedrooms_count) params.append("bedrooms", bedrooms_count)
    if (propertyType) params.append("propertyType", propertyType)
    if (budget) params.append("budget", budget)
    
    const queryString = params.toString()
    router.push(`/property?${queryString}`)
  }

  if (!isClient) return null

  if (!isClient) return null

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-foreground/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[600px] flex-col items-center justify-center px-4 lg:min-h-[700px]">
        {/* Search form */}
        <div className="w-full max-w-4xl">
          {/* Custom tabs */}
          <div className="mx-auto mb-0 grid w-full max-w-md grid-cols-3 rounded-t-md bg-foreground/80">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                type="button"
                suppressHydrationWarning
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-medium transition-colors ${
                  i === 0 ? "rounded-tl-md" : ""
                } ${i === tabs.length - 1 ? "rounded-tr-md" : ""} ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-background/70 hover:text-background"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search form content */}
          <div className="rounded-b-md rounded-tr-md bg-background p-4 shadow-2xl md:p-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {/* City search */}
              <div className="lg:col-span-1">
                <Input
                  placeholder="Ville ou code postal..."
                  className="h-11 border-border bg-background text-foreground"
                  suppressHydrationWarning
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              {/* Bedrooms */}
              <Select value={bedrooms_count} onValueChange={setBedrooms}>
                <SelectTrigger className="h-11 border-border bg-background text-foreground" suppressHydrationWarning>
                  <SelectValue placeholder="Chambres" />
                </SelectTrigger>
                <SelectContent>
                  {bedrooms.map((b) => (
                    <SelectItem key={b} value={b}>{b} {parseInt(b) > 1 ? "Chambres" : "Chambre"}</SelectItem>
                  ))}
                  <SelectItem value="all">Tous</SelectItem>
                </SelectContent>
              </Select>

              {/* Property type */}
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-11 border-border bg-background text-foreground" suppressHydrationWarning>
                  <SelectValue placeholder="Type de bien" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Budget */}
              <Input
                placeholder={activeTab === "louer" ? "Loyer Max" : "Budget Max"}
                type="number"
                className="h-11 border-border bg-background text-foreground"
                suppressHydrationWarning
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <Button
                variant="ghost"
                suppressHydrationWarning
                className="text-sm text-muted-foreground hover:text-primary"
              >
                <SlidersHorizontal className="mr-1.5 h-4 w-4" />
                {"Avancé"}
              </Button>
              <Button
                suppressHydrationWarning
                onClick={handleSearch}
                className="h-11 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              >
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        {/* Callback CTA */}
        <Link href="/contact" className="fixed bottom-4 right-4 z-50">
          <Button
            variant="outline"
            suppressHydrationWarning
            className="border-accent bg-accent/10 text-accent hover:bg-accent hover:text-foreground"
          >
            <Phone className="mr-2 h-4 w-4" />
            On vous rappelle
          </Button>
        </Link>
      </div>
    </section>
  )
}