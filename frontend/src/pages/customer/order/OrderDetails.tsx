import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Card } from "@/components/ui/display/card"
import { Button } from "@/components/ui/forms/button"
import { Separator } from "@/components/ui/display/separator"
import { Badge } from "@/components/ui/display/badge"
import { Package, MapPin, CheckCircle2, Circle, ArrowLeft, Star } from "lucide-react"
import { dummyOrders, type OrderItem } from "@/data/orders-data"

const trackingSteps = ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"]

const getSavedOrders = () => {
  const saved = localStorage.getItem("my-orders")
  return saved ? JSON.parse(saved) : dummyOrders
}

const OrderDetails = () => {
  const { id } = useParams()

  const [allOrders, setAllOrders] = useState(() => getSavedOrders())
  const [reviewOpenId, setReviewOpenId] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem("my-orders", JSON.stringify(allOrders))
  }, [allOrders])

  const order = allOrders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="max-w-xl mx-auto w-full py-8 px-3 text-center">
        <Package className="w-8 h-8 text-muted-foreground mb-2.5 mx-auto" />
        <p className="text-xs text-muted-foreground mb-3">Order not found.</p>
        <Link to="/my-orders">
          <Button size="sm" variant="outline">Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const items: OrderItem[] = order.items

  const setItemRating = (itemId: number, value: number) => {
    setAllOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, items: o.items.map((it) => (it.id === itemId ? { ...it, rating: value } : it)) }
          : o
      )
    )
  }

  const setItemReview = (itemId: number, value: string) => {
    setAllOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, items: o.items.map((it) => (it.id === itemId ? { ...it, review: value } : it)) }
          : o
      )
    )
  }

  return (
    <div className="max-w-xl mx-auto w-full py-3 px-3">
      <Link
        to="/my-orders"
        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mb-2.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h1 className="text-base font-bold">{order.id}</h1>
          <p className="text-[11px] text-muted-foreground">Placed on {order.date}</p>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 h-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        >
          {order.status}
        </Badge>
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Tracking */}
        <Card className="p-2.5">
          <h2 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-primary" />
            Tracking
          </h2>
          <div className="flex flex-col gap-0">
            {trackingSteps.map((step, i) => {
              const done = i <= order.currentStep
              const isLast = i === trackingSteps.length - 1
              return (
                <div key={step} className="flex gap-2">
                  <div className="flex flex-col items-center">
                    {done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    {!isLast && (
                      <div
                        className={`w-px flex-1 min-h-[14px] ${
                          i < order.currentStep ? "bg-emerald-400" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`text-[11px] pb-3 ${
                      done ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Shipping */}
        <Card className="p-2.5">
          <h2 className="text-xs font-semibold mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            Shipping Address
          </h2>
          <p className="text-xs text-muted-foreground">{order.address}</p>
        </Card>

        {/* Items — now with per-item rating & review */}
        <Card className="p-2.5">
          <h2 className="text-xs font-semibold mb-1.5">Items</h2>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between text-xs">
                  <p className="truncate">{item.name} <span className="text-muted-foreground">x{item.qty}</span></p>
                  <p className="font-medium">₹{item.price.toFixed(2)}</p>
                </div>

                {order.status === "Delivered" && (
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setItemRating(item.id, star)}>
                          <Star
                            className={`w-3.5 h-3.5 transition-colors ${
                              star <= item.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground hover:text-amber-400/50"
                            }`}
                          />
                        </button>
                      ))}
                      {item.rating > 0 && (
                        <span className="text-[10px] text-muted-foreground ml-1">{item.rating}/5</span>
                      )}
                      <button
                        onClick={() => setReviewOpenId(reviewOpenId === item.id ? null : item.id)}
                        className="text-[11px] text-primary font-medium hover:underline ml-auto"
                      >
                        {item.review ? "Edit review" : "Write review"}
                      </button>
                    </div>

                    {item.review && reviewOpenId !== item.id && (
                      <p className="text-[11px] text-muted-foreground italic leading-tight">
                        "{item.review}"
                      </p>
                    )}

                    {reviewOpenId === item.id && (
                      <div className="flex flex-col gap-1">
                        <textarea
                          value={item.review}
                          onChange={(e) => setItemReview(item.id, e.target.value)}
                          placeholder={`Share your experience with ${item.name}...`}
                          className="w-full text-xs rounded-md border border-border bg-transparent p-1.5 min-h-[40px] resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Button
                          size="sm"
                          className="h-6 text-[11px] self-end px-3"
                          onClick={() => setReviewOpenId(null)}
                        >
                          Save Review
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Separator className="my-2" />

          <div className="flex items-center justify-between text-xs mb-1">
            <p className="text-muted-foreground">Payment Method</p>
            <p className="font-medium">{order.paymentMethod}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">Total</p>
            <p className="text-sm font-bold text-primary">₹{order.total.toFixed(2)}</p>
          </div>
        </Card>

        <Button variant="outline" className="w-full h-8 text-xs">
          Need Help With This Order?
        </Button>
      </div>
    </div>
  )
}

export default OrderDetails