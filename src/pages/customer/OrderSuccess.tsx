import { Link } from "react-router-dom"
import { Card } from "@/components/ui/display/card"
import { Button } from "@/components/ui/forms/button"
import { CheckCircle2 } from "lucide-react"

const OrderSuccess = () => {
  const orderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <div className="max-w-md mx-auto w-full py-16 px-3 flex flex-col items-center text-center">
      <Card className="p-6 w-full flex flex-col items-center">
        <CheckCircle2 className="w-14 h-14 text-primary mb-3" />

        <h1 className="text-lg font-bold mb-1">Order Placed!</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Thank you for shopping with PlantShop.
        </p>

        <div className="w-full rounded-md border border-border px-3 py-2 mb-5">
          <p className="text-xs text-muted-foreground">Order ID</p>
          <p className="text-sm font-semibold">{orderId}</p>
        </div>

        <div className="flex gap-2 w-full">
          <Link to="/product" className="flex-1">
            <Button variant="outline" className="w-full h-9">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/my-orders" className="flex-1">
            <Button className="w-full h-9">
              View Orders
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default OrderSuccess