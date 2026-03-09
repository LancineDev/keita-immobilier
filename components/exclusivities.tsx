"use client"

import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Bed, Maximize, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const exclusiveListings = [
  {
    image: "/images/property-1.jpg",
    type: "VENTE",
    price: "264 000 000 FCFA",
    title: "Bezons - Appartement duplex 3 pieces",
    bedrooms: 2,
    area: 70,
  },
  {
    image: "/images/property-2.jpg",
    type: "LOCATION",
    price: "850 000 FCFA/mois",
    title: "Cocody - Villa Duplex 5 pieces",
    bedrooms: 4,
    area: 250,
  },
  {
    image: "/images/property-3.jpg",
    type: "VENTE",
    price: "180 000 000 FCFA",
    title: "Marcory - Appartement standing 4 pieces",
    bedrooms: 3,
    area: 120,
  },
  {
    image: "/images/building.jpg",
    type: "VENTE",
    price: "350 000 000 FCFA",
    title: "Plateau - Bureau commercial 200m2",
    bedrooms: 6,
    area: 200,
  },
]

export function Exclusivities() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 380
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold text-foreground lg:text-4xl">
            {"Nos Exclusivités"}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              suppressHydrationWarning
              className="h-10 w-10 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Précédent</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              suppressHydrationWarning
              className="h-10 w-10 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Suivant</span>
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {exclusiveListings.map((listing) => (
            <div
              key={listing.title}
              className="group min-w-[320px] max-w-[350px] flex-shrink-0 cursor-pointer overflow-hidden rounded-md bg-background shadow-md transition-shadow hover:shadow-xl border border-border"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={listing.image}
                  alt={listing.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex gap-2">
                  <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                    Exclusivité
                  </Badge>
                  <Badge className={`text-xs font-semibold ${listing.type === "VENTE" ? "bg-accent text-foreground" : "bg-emerald-600 text-background"}`}>
                    {listing.type}
                  </Badge>
                </div>
                <button
                  suppressHydrationWarning
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground/60 transition-colors hover:text-primary"
                  aria-label="Ajouter aux favoris"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5">
                <p className="mb-2 font-serif text-lg font-bold text-primary">
                  {listing.price}
                </p>
                <h3 className="mb-3 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Bed className="h-3.5 w-3.5" />
                    {listing.bedrooms} Ch
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize className="h-3.5 w-3.5" />
                    {listing.area} m²
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}