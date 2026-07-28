import { Link } from "react-router-dom"
import { Card } from "@/components/ui/display/card"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Package, Star, CheckCircle2, Truck, XCircle } from "lucide-react"
import { useState } from "react"
import { dummyOrders } from "@/data/orders-data"

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  Delivered: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  Shipped: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Truck },
  Cancelled: { color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
}

const MyOrders = () => {
  const [orders, setOrders] = useState(dummyOrders)
  // key: `${orderId}-${itemId}` for whichever item's review box is open
  const [reviewOpenKey, setReviewOpenKey] = useState<string | null>(null)

  const setItemRating = (orderId: string, itemId: number, value: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: o.items.map((it) =>
                it.id === itemId ? { ...it, rating: value } : it
              ),
            }
          : o
      )
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="w-8 h-8 text-muted-foreground mb-2.5" />
        <p className="text-sm text-muted-foreground mb-3">No orders yet.</p>
        <Link to="/product">
          <Button size="sm">Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto w-full py-3 px-3">
      <h1 className="text-base font-bold mb-0.5">My Orders</h1>
      <p className="text-xs text-muted-foreground mb-2.5">
        {orders.length} order{orders.length > 1 ? "s" : ""} placed
      </p>

      <div className="flex flex-col gap-2">
        {orders.map((order) => {
          const StatusIcon = statusConfig[order.status].icon
          return (
            <Card
              key={order.id}
              className="p-2.5 border-border/60 hover:border-border transition-colors"
            >
              <Link to={`/my-orders/${order.id}`} className="flex items-start gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${statusConfig[order.status].color}`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate">{order.productName}</p>
                    <p className="text-sm font-bold shrink-0">₹{order.total.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[11px] text-muted-foreground">{order.id}</p>
                    <span className="text-muted-foreground text-[11px]">·</span>
                    <p className="text-[11px] text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                    <span className="text-muted-foreground text-[11px]">·</span>
                    <p className="text-[11px] text-muted-foreground">{order.date}</p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 h-4 mt-1 ${statusConfig[order.status].color}`}
                  >
                    {order.status}
                  </Badge>
                </div>
              </Link>

              {order.status === "Delivered" && (
                <div className="mt-2 pt-2 border-t border-border/60 flex flex-col gap-1.5">
                  {order.items.map((item) => {
                    const key = `${order.id}-${item.id}`
                    return (
                      <div key={item.id} className="flex items-center justify-between gap-2">
                        <p className="text-[11px] text-muted-foreground truncate flex-1">{item.name}</p>
                        {reviewOpenKey !== key ? (
                          <button
                            onClick={() => setReviewOpenKey(key)}
                            className="flex items-center gap-1 text-xs text-primary font-medium hover:underline shrink-0"
                          >
                            <Star className="w-3 h-3" />
                            {item.rating > 0 ? "Edit rating" : "Rate item"}
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 shrink-0">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} onClick={() => setItemRating(order.id, item.id, star)}>
                                <Star
                                  className={`w-3.5 h-3.5 transition-colors ${
                                    star <= item.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted-foreground hover:text-amber-400/50"
                                  }`}
                                />
                              </button>
                            ))}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-5 text-[11px] ml-2 px-2"
                              onClick={() => setReviewOpenKey(null)}
                            >
                              Save
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders