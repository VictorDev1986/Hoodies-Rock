import { Truck, RotateCcw, ShieldCheck } from "lucide-react"

export function TopBar() {
  return (
    <div className="border-b border-red-900/50 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="hidden sm:inline">Envio a</span>
            <span className="font-semibold">Colombia</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Envio Confiable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Devoluciones Faciles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Compra Segura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
