import { Link } from "react-router-dom"
import { Card } from "@/components/ui/display/card"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import {
  Package,
  Star,
  CheckCircle2,
  Truck,
  XCircle,
  Clock,
  Loader2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Calendar,
  IndianRupee,
  Leaf,
  Copy,
  Check,
  RotateCcw
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { api, type Order } from "@/services/api"
import { toast } from "sonner"

const statusConfig: Record<string, { color: string; bg: string; border: string; icon: typeof CheckCircle2; step: number }> = {
  Pending: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: Clock,
    step: 1
  },
  Shipped: {
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    icon: Truck,
    step: 2
  },
  Delivered: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: CheckCircle2,
    step: 3
  },
  Cancelled: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    icon: XCircle,
    step: 0
  },
}

const steps = ["Order Placed", "In Preparation", "Out for Delivery", "Delivered"]

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Reviews state
  const [itemRatings, setItemRatings] = useState<Record<string, number>>({})

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email")
      const data = await api.getOrders(userEmail || undefined)
      setOrders(data)
    } catch (err) {
      console.error("Failed to fetch my orders:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const setItemRating = (key: string, value: number) => {
    setItemRatings((prev) => ({ ...prev, [key]: value }))
    toast.success("Thank you for your rating!")
  }

  const handleCopy = (orderId: string) => {
    navigator.clipboard.writeText(orderId)
    setCopiedId(orderId)
    toast.success("Order ID copied to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (selectedFilter === "all") return orders
    return orders.filter((o) => o.status.toLowerCase() === selectedFilter.toLowerCase())
  }, [orders, selectedFilter])

  // Stats calculation
  const totalSpent = useMemo(() => orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0), [orders])
  const activeOrdersCount = useMemo(() => orders.filter((o) => o.status === "Pending" || o.status === "Shipped").length, [orders])
  const deliveredCount = useMemo(() => orders.filter((o) => o.status === "Delivered").length, [orders])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl -z-10" />
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Loading Your Orders</h2>
        <p className="text-sm text-zinc-400">Retrieving your latest order history & delivery updates...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
        
        <Card className="w-full max-w-md p-8 bg-zinc-900/40 border-zinc-800 backdrop-blur-xl text-center rounded-3xl shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner text-emerald-400">
            <ShoppingBag className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white">No Orders Placed Yet</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your botanical journey hasn't started yet! Explore our hand-picked healthy indoor and outdoor plants.
            </p>
          </div>

          <Link to="/product" className="block">
            <Button className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Leaf className="w-4 h-4" />
              Explore Plants
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[85vh] bg-zinc-950 text-white py-6 sm:py-10 px-3 sm:px-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-emerald-600/5 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        
        {/* ── Page Top Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/30 p-5 sm:p-6 rounded-2xl border border-zinc-800/60 backdrop-blur-xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-green-500/20" />
          
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 text-[11px] px-2.5 py-0.5 font-medium rounded-full">
                  Customer Portal
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">My Orders</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Track status, delivery schedules, and receipt details for your plants
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              onClick={fetchOrders}
              variant="outline"
              size="sm"
              className="border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:text-white rounded-xl h-9 px-3.5 flex items-center gap-2 text-xs cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Refresh
            </Button>
            <Link to="/product">
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl h-9 px-4 flex items-center gap-1.5 text-xs shadow-md cursor-pointer"
              >
                <Leaf className="w-3.5 h-3.5" />
                Shop More
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Summary Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-4 flex items-center gap-3.5 backdrop-blur-md">
            <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-300 shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 truncate">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">{orders.length}</p>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-4 flex items-center gap-3.5 backdrop-blur-md">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 truncate">Total Spent</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">₹{totalSpent.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-4 flex items-center gap-3.5 backdrop-blur-md">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 truncate">Active Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-sky-400 tracking-tight">{activeOrdersCount}</p>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-4 flex items-center gap-3.5 backdrop-blur-md">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 truncate">Delivered</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">{deliveredCount}</p>
            </div>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900/40 p-1.5 rounded-2xl border border-zinc-800/80 overflow-x-auto max-w-full">
          {[
            { id: "all", label: "All Orders", count: orders.length },
            { id: "pending", label: "Pending", count: orders.filter((o) => o.status === "Pending").length },
            { id: "shipped", label: "Shipped", count: orders.filter((o) => o.status === "Shipped").length },
            { id: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "Delivered").length },
            { id: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "Cancelled").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selectedFilter === tab.id
                  ? "bg-emerald-500 text-zinc-950 shadow-md font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedFilter === tab.id ? "bg-zinc-950/20 text-zinc-950 font-black" : "bg-zinc-800 text-zinc-400"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Order Cards List ── */}
        <div className="space-y-4 sm:space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl p-8">
              <Package className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-400">No orders found in this category.</p>
              <p className="text-xs text-zinc-500 mt-1">Try selecting a different filter tab above.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const config = statusConfig[order.status] || statusConfig["Pending"]
              const StatusIcon = config.icon
              const currentStep = config.step

              return (
                <Card
                  key={order.id}
                  className="bg-zinc-900/40 border-zinc-800/70 hover:border-zinc-700/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all duration-300 space-y-4 relative overflow-hidden group"
                >
                  {/* Top Accent Line based on status */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] ${order.status === "Delivered" ? "bg-emerald-500" : order.status === "Shipped" ? "bg-sky-500" : order.status === "Pending" ? "bg-amber-500" : "bg-rose-500"}`} />

                  {/* 1. Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-zinc-800/60">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleCopy(order.id)}
                          className="flex items-center gap-1.5 bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800 px-2.5 py-0.5 rounded-lg text-xs font-mono font-medium text-emerald-400 transition-colors cursor-pointer"
                          title="Click to copy Order ID"
                        >
                          <span>{order.id}</span>
                          {copiedId === order.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-zinc-500 hover:text-emerald-400" />
                          )}
                        </button>
                        
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Placed on {order.date}</span>
                        </div>
                      </div>

                      {order.customerName && (
                        <p className="text-xs text-zinc-400">
                          Recipient: <span className="text-zinc-200 font-medium">{order.customerName}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3.5">
                      <Badge className={`${config.bg} ${config.color} ${config.border} flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium shadow-sm`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{order.status}</span>
                      </Badge>

                      <div className="text-right">
                        <p className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500">Order Total</p>
                        <p className="text-lg sm:text-xl font-bold text-white tracking-tight">₹{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Order Tracking Timeline (Visual Bar) */}
                  {order.status !== "Cancelled" && (
                    <div className="py-3 px-3 sm:px-6 bg-zinc-950/40 rounded-2xl border border-zinc-800/60">
                      <div className="flex items-center justify-between relative">
                        {steps.map((stepLabel, idx) => {
                          const isDone = idx <= currentStep
                          const isCurrent = idx === currentStep

                          return (
                            <div key={stepLabel} className="flex flex-col items-center flex-1 relative z-10">
                              <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                  isCurrent
                                    ? "bg-emerald-500 text-zinc-950 ring-4 ring-emerald-500/20 shadow-lg shadow-emerald-500/20 animate-pulse"
                                    : isDone
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                    : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                                }`}
                              >
                                {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                              </div>
                              <span
                                className={`text-[10px] sm:text-[11px] mt-1.5 text-center font-medium ${
                                  isCurrent
                                    ? "text-emerald-400 font-bold"
                                    : isDone
                                    ? "text-zinc-300"
                                    : "text-zinc-600"
                                }`}
                              >
                                {stepLabel}
                              </span>
                            </div>
                          )
                        })}

                        {/* Connecting Line */}
                        <div className="absolute top-3.5 sm:top-4 left-6 right-6 h-[2px] bg-zinc-800 -z-0">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{
                              width: `${(Math.min(currentStep, steps.length - 1) / (steps.length - 1)) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Items Gallery List */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Ordered Plants ({order.items?.length || 0})
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {order.items && order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 hover:border-zinc-700/80 transition-all"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Leaf className="w-6 h-6 text-emerald-500/40" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                              <span className="font-mono text-emerald-400 font-bold">₹{item.price}</span>
                              <span>•</span>
                              <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded text-[10px] font-bold">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0 pr-1">
                            <span className="text-xs font-bold text-white">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Rating & Reviews for Delivered Orders */}
                  {order.status === "Delivered" && order.items && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <Sparkles className="w-4 h-4" />
                        <span>How was your experience? Rate your plants:</span>
                      </div>

                      <div className="space-y-2 pt-1">
                        {order.items.map((item) => {
                          const key = `${order.id}-${item.id}`
                          const currentRating = itemRatings[key] || 0

                          return (
                            <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                              <span className="text-zinc-300 truncate max-w-[200px]">{item.name}</span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setItemRating(key, star)}
                                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                  >
                                    <Star
                                      className={`w-4 h-4 ${
                                        star <= currentRating
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-zinc-600 hover:text-amber-400/60"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* 5. Card Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span>Standard Safe Express Plant Delivery</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to="/contact">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 px-3 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl"
                        >
                          Need Help?
                        </Button>
                      </Link>
                      <Link to="/product">
                        <Button
                          size="sm"
                          className="h-9 px-4 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Leaf className="w-3.5 h-3.5" />
                          Buy Again
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}

export default MyOrders