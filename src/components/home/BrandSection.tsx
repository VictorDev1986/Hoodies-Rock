const styles = ["Rock clásico", "Metal", "Punk", "Ska", "Oi!", "Grunge", "Indie", "Hard rock", "Alternativo", "Vintage", "Otro género"]

export function BrandSection() {
  return (
    <section className="py-12 sm:py-16 border-t">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-(family-name:--font-display) text-4xl uppercase tracking-wide sm:text-5xl">Tu estilo. Tu escenario.</h2>
          <p className="mt-2 text-muted-foreground">
            Prendas para cada riff, cada concierto y cada historia.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
          {styles.map((style) => (
            <Link
              key={style}
              href={`/products?genre=${encodeURIComponent(style === "Otro género" ? "Otro" : style)}`}
              className="flex items-center justify-center border border-border bg-muted/50 px-4 py-2 transition-colors hover:border-primary hover:bg-primary/10"
            >
              <span className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors">
                {style}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
import Link from "next/link"
