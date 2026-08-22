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
    <div className="max-w-3xl mx-auto w-full py-4 sm:py-8 px-2 sm:px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Your Cart</h1>

      <div className="flex flex-col gap-3 sm:gap-4">
        {items.map((item) => (
          <Card key={item.id} className="p-3 sm:p-4 bg-zinc-900/60 border-zinc-800">
            {/* Desktop View */}
            <div className="hidden sm:flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-18 h-18 object-cover rounded-lg shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{item.name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">₹{item.price.toFixed(2)} each</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-zinc-700 hover:bg-zinc-800"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <span className="w-7 text-center font-bold text-sm">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-zinc-700 hover:bg-zinc-800"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>

              <p className="w-24 text-right font-bold text-emerald-400">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>

              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-red-500/10 text-zinc-400 hover:text-red-400 cursor-pointer"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile View */}
            <div className="flex sm:hidden flex-col gap-3">
              <div className="flex items-start gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">₹{item.price.toFixed(2)} each</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 -mt-1 -mr-1"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <div className="flex items-center gap-2 bg-zinc-950/60 border border-zinc-800 rounded-lg p-0.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-zinc-400 hover:text-white"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-zinc-400 hover:text-white"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="text-xs text-zinc-500">Subtotal</p>
                  <p className="text-sm font-bold text-emerald-400">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 sm:mt-8 border-t border-border pt-4">
        <Button variant="outline" onClick={clearCart} className="border-zinc-800 text-zinc-400 hover:text-white">
          Clear Cart
        </Button>

        <div className="flex items-center justify-between sm:justify-end gap-4 text-right">
          <div>
            <p className="text-xs text-muted-foreground">Order Total</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-400">₹{totalPrice.toFixed(2)}</p>
          </div>
          <Link to="/checkout" className="block sm:inline-block">
            <Button size="lg" className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold">
              Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart