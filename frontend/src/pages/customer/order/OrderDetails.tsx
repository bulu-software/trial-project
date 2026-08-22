import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Card } from "@/components/ui/display/card"
import { Button } from "@/components/ui/forms/button"
import { Separator } from "@/components/ui/display/separator"
import { Badge } from "@/components/ui/display/badge"
import {
  Package,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Truck,
  Clock,
  XCircle,
  Calendar,
  CreditCard,
  Leaf
} from "lucide-react"
import { api, type Order } from "@/services/api"
import { dummyOrders } from "@/data/orders-data"

const trackingSteps = ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"]

const statusConfig: Record<string, { color: string; bg: string; border: string; icon: typeof CheckCircle2; step: number }> = {
  Pending: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock, step: 1 },
  Shipped: { color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", icon: Truck, step: 2 },
  Delivered: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2, step: 4 },
  Cancelled: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: XCircle, step: 0 },
}

const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email")
        const orders = await api.getOrders(userEmail || undefined)
        const found = orders.find((o) => o.id === id)
        if (found) {
          setOrder(found)
        } else {
          // Fallback to dummy
          const dummy = dummyOrders.find((o) => o.id === id)
          if (dummy) {
            setOrder({
              id: dummy.id,
              customerName: "Customer",
              customerEmail: userEmail || "customer@example.com",
              items: dummy.items.map((it) => ({
                id: it.id,
                name: it.name,
                price: it.price,
                quantity: it.qty,
                image: undefined,
              })),
              total: dummy.total,
              status: dummy.status,
              date: dummy.date,
            })
          }
        }
      } catch (err) {
        console.error("Failed to load order:", err)
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-pulse mb-3">
          <Package className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-sm text-zinc-400">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] max-w-xl mx-auto w-full py-12 px-4 text-center">
        <Package className="w-12 h-12 text-zinc-600 mb-3 mx-auto" />
        <h2 className="text-xl font-bold text-white mb-1">Order Not Found</h2>
        <p className="text-xs text-zinc-400 mb-5">We couldn't find the order with ID "{id}".</p>
        <Link to="/my-orders">
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl">
            Back to My Orders
          </Button>
        </Link>
      </div>
    )
  }

  const config = statusConfig[order.status] || statusConfig["Pending"]
  const currentStep = config.step

  return (
    <div className="min-h-[85vh] bg-zinc-950 text-white py-6 sm:py-10 px-3 sm:px-6 relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Header Panel */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 sm:p-6 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-mono text-emerald-400 tracking-tight">{order.id}</h1>
              <Badge className={`${config.bg} ${config.color} ${config.border} text-xs px-2.5 py-0.5 rounded-full font-bold`}>
                {order.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>Placed on {order.date}</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Total Paid</p>
            <p className="text-2xl font-black text-white">₹{order.total.toLocaleString()}</p>
          </div>
        </div>

        {/* Tracking Timeline */}
        <Card className="p-5 sm:p-6 bg-zinc-900/40 border-zinc-800/80 rounded-3xl backdrop-blur-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            Tracking Progress
          </h2>

          <div className="flex flex-col gap-0 pl-2">
            {trackingSteps.map((step, i) => {
              const done = i <= currentStep
              const isLast = i === trackingSteps.length - 1
              return (
                <div key={step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${done ? "bg-emerald-500 text-zinc-950 font-bold" : "bg-zinc-800 text-zinc-600"}`}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 min-h-[24px] my-1 ${done && i < currentStep ? "bg-emerald-500" : "bg-zinc-800"}`} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-xs font-semibold ${done ? "text-white" : "text-zinc-500"}`}>{step}</p>
                    <p className="text-[10px] text-zinc-500">
                      {done ? "Completed" : "Pending step"}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Ordered Plants */}
        <Card className="p-5 sm:p-6 bg-zinc-900/40 border-zinc-800/80 rounded-3xl backdrop-blur-xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            Ordered Plants ({order.items.length})
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/40 border border-zinc-800/80">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Leaf className="w-5 h-5 text-emerald-500/40" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                    <p className="text-xs text-zinc-400">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                </div>

                <p className="text-sm font-bold text-emerald-400 font-mono">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <Separator className="bg-zinc-800" />

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Payment Mode</span>
              <span className="text-zinc-200 font-medium flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Online / Verified
              </span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Standard Safe Delivery</span>
              <span className="text-emerald-400 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
              <span>Total Amount</span>
              <span className="text-emerald-400 text-base">₹{order.total.toLocaleString()}</span>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}

export default OrderDetails