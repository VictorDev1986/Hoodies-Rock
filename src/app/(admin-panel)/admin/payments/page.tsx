"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AdminOrder = {
  id: string
  orderNumber: string
  customer: { name: string | null; email: string }
  status: string
  total: number
  paymentMethod: string
  createdAt: string
}

type PaymentStatus = "completed" | "pending" | "refunded"

type Payment = {
  id: string
  orderId: string
  userName: string
  amount: number
  method: string
  status: PaymentStatus
  createdAt: string
}

const statusConfig = {
  completed: { label: "Completado", variant: "default" as const, className: "bg-green-600" },
  pending: { label: "Pendiente", variant: "secondary" as const, className: "" },
  refunded: { label: "Reembolsado", variant: "outline" as const, className: "" },
}

function paymentStatusFromOrder(status: string): PaymentStatus {
  if (status === "cancelled") return "refunded"
  if (status === "pending") return "pending"
  return "completed"
}

function paymentMethodLabel(method: string) {
  const labels: Record<string, string> = {
    card: "Tarjeta",
    stripe: "Tarjeta",
    transfer: "Transferencia",
    bank_transfer: "Transferencia",
    wallet: "Billetera",
    cash_on_delivery: "Contra entrega",
  }
  return labels[method.toLowerCase()] || method
}

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/admin/orders")
        if (!response.ok) throw new Error("No se pudieron cargar los pagos")
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    loadOrders()
  }, [])

  const payments = useMemo<Payment[]>(
    () => orders.map((order) => ({
      id: order.id,
      orderId: order.orderNumber,
      userName: order.customer.name || order.customer.email,
      amount: order.total,
      method: order.paymentMethod,
      status: paymentStatusFromOrder(order.status),
      createdAt: new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(order.createdAt)),
    })),
    [orders]
  )

  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      payment.userName.toLowerCase().includes(query) ||
      payment.id.toLowerCase().includes(query) ||
      payment.orderId.toLowerCase().includes(query)
    return matchesSearch && (statusFilter === "all" || payment.status === statusFilter)
  })

  const totalFor = (status: PaymentStatus) => payments
    .filter((payment) => payment.status === status)
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pagos</h1>
          <p className="text-muted-foreground">Pagos asociados a los pedidos reales de la tienda</p>
        </div>
        <Button variant="outline" disabled>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Recibido</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">COP ${totalFor("completed").toLocaleString("es-CO")}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pendiente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">COP ${totalFor("pending").toLocaleString("es-CO")}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Reembolsado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">COP ${totalFor("refunded").toLocaleString("es-CO")}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Transacciones</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{payments.length}</p></CardContent></Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Buscar por pedido o cliente..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="pl-8" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="completed">Completado</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="refunded">Reembolsado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>ID Pago</TableHead><TableHead>Cliente</TableHead><TableHead>Pedido</TableHead><TableHead>Método</TableHead><TableHead>Monto</TableHead><TableHead>Estado</TableHead><TableHead>Fecha</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Cargando pagos...</TableCell></TableRow>
              ) : filteredPayments.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Aún no hay pagos registrados.</TableCell></TableRow>
              ) : filteredPayments.map((payment) => {
                const status = statusConfig[payment.status]
                return <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                  <TableCell>{payment.userName}</TableCell>
                  <TableCell className="font-mono text-sm">{payment.orderId}</TableCell>
                  <TableCell>{paymentMethodLabel(payment.method)}</TableCell>
                  <TableCell className="font-medium">COP ${payment.amount.toLocaleString("es-CO")}</TableCell>
                  <TableCell><Badge variant={status.variant} className={status.className}>{status.label}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{payment.createdAt}</TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
