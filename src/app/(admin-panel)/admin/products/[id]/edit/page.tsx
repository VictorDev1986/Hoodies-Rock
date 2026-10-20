"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/admin/ImageUpload"

type Category = { id: string; name: string }
type UploadedImage = { url: string; publicId: string }
type Product = {
  id: string; name: string; slug: string; description: string; price: number
  originalPrice?: number; stock: number; images: string[]; categoryId: string; brandId: string
  genre?: string; otherGenre?: string
  isNew: boolean; isFeatured: boolean
}

const genres = ["Rock clásico", "Metal", "Punk", "Ska", "Oi!", "Grunge", "Indie", "Hard rock", "Alternativo", "Vintage", "Otro"]

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const [productRes, categoriesRes] = await Promise.all([
        fetch(`/api/products/${id}`), fetch("/api/categories"),
      ])
      if (!productRes.ok) { setLoading(false); return }
      const data = await productRes.json() as Product
      setProduct(data)
      setImages(data.images.map((url) => ({
        url,
        publicId: url.startsWith("/uploads/") ? `local/${url.split("/").pop()}` : url,
      })))
      setCategories(await categoriesRes.json())
      setLoading(false)
    }
    load()
  }, [id])

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!product || images.length === 0) return
    setSaving(true)
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...product,
        comparePrice: product.originalPrice,
        images: images.map((image) => image.url),
        isActive: true,
      }),
    })
    setSaving(false)
    if (response.ok) router.push("/admin/products")
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
  if (!product) return <div className="py-12 text-center">Producto no encontrado.</div>

  const update = <K extends keyof Product>(key: K, value: Product[K]) => setProduct({ ...product, [key]: value })

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/admin/products"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div><h1 className="text-2xl font-bold">Editar Producto</h1><p className="text-muted-foreground">Actualiza la información del producto.</p></div>
      </div>
      <Card><CardHeader><CardTitle>Información básica</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Nombre</Label><Input value={product.name} onChange={(e) => update("name", e.target.value)} required /></div>
        <div className="space-y-2"><Label>Slug</Label><Input value={product.slug} onChange={(e) => update("slug", e.target.value)} required /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Descripción</Label><Textarea value={product.description} onChange={(e) => update("description", e.target.value)} required /></div>
        <div className="space-y-2"><Label>Categoría</Label><Select value={product.categoryId} onValueChange={(value) => update("categoryId", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label>Género musical</Label><Select value={product.genre || undefined} onValueChange={(value) => update("genre", value)}><SelectTrigger><SelectValue placeholder="Seleccionar género" /></SelectTrigger><SelectContent>{genres.map((genre) => <SelectItem key={genre} value={genre}>{genre === "Otro" ? "Otro género" : genre}</SelectItem>)}</SelectContent></Select></div>
        {product.genre === "Otro" && <div className="space-y-2"><Label>Otro género</Label><Input value={product.otherGenre || ""} onChange={(e) => update("otherGenre", e.target.value)} placeholder="Ej. Ska, Blues rock..." required /></div>}
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Precio e inventario</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2"><Label>Precio (COP)</Label><Input type="number" value={product.price} onChange={(e) => update("price", Number(e.target.value))} required /></div>
        <div className="space-y-2"><Label>Precio anterior</Label><Input type="number" value={product.originalPrice ?? ""} onChange={(e) => update("originalPrice", e.target.value ? Number(e.target.value) : undefined)} /></div>
        <div className="space-y-2"><Label>Stock</Label><Input type="number" value={product.stock} onChange={(e) => update("stock", Number(e.target.value))} required /></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Imágenes</CardTitle></CardHeader><CardContent><ImageUpload value={images} onChange={setImages} /></CardContent></Card>
      <Card><CardContent className="flex gap-6 pt-6"><div className="flex items-center gap-2"><Checkbox checked={product.isNew} onCheckedChange={(checked) => update("isNew", Boolean(checked))} /><Label>Producto nuevo</Label></div><div className="flex items-center gap-2"><Checkbox checked={product.isFeatured} onCheckedChange={(checked) => update("isFeatured", Boolean(checked))} /><Label>Producto destacado</Label></div></CardContent></Card>
      <div className="flex gap-3"><Button type="button" variant="outline" asChild><Link href="/admin/products">Cancelar</Link></Button><Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</Button></div>
    </form>
  )
}
