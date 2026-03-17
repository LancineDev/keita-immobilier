"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Phone, Mail, Facebook, Instagram, Linkedin, Youtube,
  Menu, User, Home, Key, ShoppingBag, ClipboardList,
  ConciergeBell, Building2, Lightbulb, MessageSquare,
  Search, SlidersHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { href: "/a-propos", label: "A PROPOS", icon: Home },
  { href: "/location", label: "LOCATION", icon: Key },
  { href: "/vente", label: "VENTE", icon: ShoppingBag },
  { href: "/gestion", label: "GESTION", icon: ClipboardList },
  { href: "/conciergerie", label: "CONCIERGERIE", icon: ConciergeBell },
  { href: "/syndic", label: "SYNDIC", icon: Building2 },
  { href: "/conseil-en-immobilier", label: "CONSEIL EN IMMOBILIER", icon: Lightbulb },
  { href: "/contact", label: "CONTACT", icon: MessageSquare },
]

const propertyTypes = [
  "Appartement", "Maison", "Terrain", "Local commercial", "Parking",
  "Bureau", "Villa Basse", "Villa Duplex", "Studio", "Immeuble"
]

const bedrooms = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <a href="tel:+22527213525" className="flex items-center gap-1.5 transition-colors hover:text-accent">
              <Phone className="h-3 w-3" />
              <span className="hidden sm:inline">+225 27 21 35 25 47 / 27 21 35 25 48</span>
            </a>
            <a href="mailto:contact@keita.ci" className="flex items-center gap-1.5 transition-colors hover:text-accent">
              <Mail className="h-3 w-3" />
              <span className="hidden sm:inline">MAIL</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="transition-colors hover:text-accent"><Facebook className="h-3.5 w-3.5" /></a>
            <a href="#" aria-label="Instagram" className="transition-colors hover:text-accent"><Instagram className="h-3.5 w-3.5" /></a>
            <a href="#" aria-label="LinkedIn" className="transition-colors hover:text-accent"><Linkedin className="h-3.5 w-3.5" /></a>
            <a href="#" aria-label="YouTube" className="transition-colors hover:text-accent"><Youtube className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link href="/" className="flex flex-shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary lg:h-12 lg:w-12">
              <span className="font-serif text-xl font-bold text-primary-foreground lg:text-2xl">K</span>
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-wide text-primary lg:text-xl">KEITA</span>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Agence Immobiliere</p>
            </div>
          </Link>

          {/* Desktop nav - icon based */}
          <div className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-2.5 py-1 text-center transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-semibold uppercase leading-tight">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/connexion"
              className="hidden items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80 lg:flex"
            >
              <User className="h-4 w-4" />
              CONNEXION
            </Link>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-background">
                <nav className="mt-8 flex flex-col gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
                      >
                        <Icon className="h-5 w-5 text-primary" />
                        {item.label}
                      </Link>
                    )
                  })}
                  <div className="my-2 border-t border-border" />
                  <Link
                    href="/connexion"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-primary"
                  >
                    <User className="h-5 w-5" />
                    CONNEXION
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Horizontal search bar - always visible on inner pages, hidden on home (hero has its own) */}
      {!isHome && <SearchBar />}
    </header>
  )
}

function SearchBar() {
  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <Input
            placeholder="Chercher une ville ou un code postal"
            className="h-9 min-w-[160px] flex-1 border-border bg-background text-sm"
          />
        </div>
        <Select>
          <SelectTrigger className="h-9 w-auto min-w-[140px] border-border text-sm">
            <SelectValue placeholder="Type d'operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="acheter">Acheter</SelectItem>
            <SelectItem value="louer">Louer</SelectItem>
            <SelectItem value="tout">Tout</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="h-9 w-auto min-w-[130px] border-border text-sm">
            <SelectValue placeholder="Type de bien" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="h-9 w-auto min-w-[110px] border-border text-sm">
            <SelectValue placeholder="Chambres" />
          </SelectTrigger>
          <SelectContent>
            {bedrooms.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Surface Min (m2)"
          type="number"
          className="h-9 w-[120px] border-border text-sm"
        />
        <Input
          placeholder="Budget Max (FCFA)"
          type="number"
          className="h-9 w-[140px] border-border text-sm"
        />
        <Button variant="ghost" size="sm" className="h-9 text-xs text-muted-foreground hover:text-primary">
          <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
          {"Avance"}
        </Button>
        <Button size="sm" className="h-9 bg-primary px-4 text-xs text-primary-foreground hover:bg-primary/90">
          Rechercher
        </Button>
      </div>
    </div>
  )
}

