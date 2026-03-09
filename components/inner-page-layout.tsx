import Link from "next/link"
import Image from "next/image"
import { Search, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface InnerPageLayoutProps {
  breadcrumbs: BreadcrumbItem[]
  title: string
  children: React.ReactNode
}

const recentProperties = [
  {
    title: "Angre 8e Tranche - Appartements Meubles (2 et 3 pieces)",
    price: "A partir de 300000 F CFA",
    tags: ["Appartement 2 Pieces", "Appartement 3 Pieces"],
    image: "/images/property-1.jpg",
    href: "#",
  },
  {
    title: "Angre 8e Tranche - Appartement 3 pieces meuble",
    price: "350000 F CFA",
    tags: ["Appartement 3 Pieces"],
    image: "/images/property-2.jpg",
    href: "#",
  },
  {
    title: "Cocody Riviera - Villa Duplex 5 pieces",
    price: "150 000 000 F CFA",
    tags: ["Villa Duplex"],
    image: "/images/property-3.jpg",
    href: "#",
  },
]

export function InnerPageLayout({ breadcrumbs, title, children }: InnerPageLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm">
          <li>
            <Link href="/" className="text-primary transition-colors hover:underline">
              Accueil
            </Link>
          </li>
          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              <span className="text-muted-foreground">{">"}</span>
              {item.href ? (
                <Link href={item.href} className="text-primary transition-colors hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="text-muted-foreground">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Title */}
      <h1 className="mb-8 font-serif text-3xl font-bold text-foreground lg:text-4xl text-balance">
        {title}
      </h1>

      {/* Two-column layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Sidebar */}
        <aside className="w-full flex-shrink-0 lg:w-[340px]">
          {/* Search box */}
          <div className="mb-6 rounded-md border border-border bg-background p-5">
            <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Recherche</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Rechercher"
                className="h-10 flex-1 border-border text-sm"
              />
              <Button size="icon" className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90">
                <Search className="h-4 w-4" />
                <span className="sr-only">Rechercher</span>
              </Button>
            </div>
          </div>

          {/* Recently viewed */}
          <div className="rounded-md border border-border bg-background p-5">
            <h3 className="mb-4 font-serif text-lg font-bold text-foreground">{"Vu recemment"}</h3>
            <div className="flex flex-col gap-4">
              {recentProperties.map((property, index) => (
                <Link key={index} href={property.href} className="group flex gap-3">
                  <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-2 text-sm font-semibold leading-tight text-primary transition-colors group-hover:underline">
                      {property.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">{property.price}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {property.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-primary/70">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Floating callback button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90">
          <Phone className="h-4 w-4" />
          On vous rappelle
        </Button>
      </div>
    </div>
  )
}
