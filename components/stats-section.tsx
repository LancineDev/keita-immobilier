"use client"

import { useEffect, useState, useRef } from "react"

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = Date.now()
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <div ref={ref} className="text-center">
      <p className="font-serif text-4xl font-bold text-accent lg:text-5xl">
        {count}{suffix}
      </p>
    </div>
  )
}

const stats = [
  { value: 30, suffix: "+", label: "Annees d'experience" },
  { value: 5000, suffix: "+", label: "Biens geres" },
  { value: 3000, suffix: "+", label: "Clients satisfaits" },
  { value: 15, suffix: "", label: "Communes couvertes" },
]

export function StatsSection() {
  return (
    <section className="bg-foreground py-14 lg:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm text-background/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
