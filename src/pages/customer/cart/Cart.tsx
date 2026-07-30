import { useCart } from "../../context/CartContext"
import { Card } from "@/components/ui/display/card"
import { Button } from "@/components/ui/forms/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-muted-foreground mb-4">Your cart is empty.</p>
        <Link to="/product">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Card key={item.id} className="flex items-center gap-4 p-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-6 text-center">{item.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <p className="w-20 text-right font-semibold">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8 border-t border-border pt-4">
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">₹{totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Link to="/checkout">
          <Button size="lg">Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  )
}

export default Cart