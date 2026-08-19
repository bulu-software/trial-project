import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCart } from "@/pages/context/CartContext"
import { Card } from "@/components/ui/display/card"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Separator } from "@/components/ui/display/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/layout/radio-group"
import { Minus, Plus, MapPin, Wallet, ShoppingBag } from "lucide-react"
import { toast } from "sonner"

const Checkout = () => {
  const { items, totalPrice, updateQuantity, clearCart } = useCart()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState("cod")

  // controlled shipping fields
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")

  const handlePlaceOrder = () => {
    if (!fullName.trim()) {
      toast.error("Please enter your name")
      return
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone number")
      return
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      toast.error("Phone number must be exactly 10 digits")
      return
    }

    if (!address.trim()) {
      toast.error("Please enter your address")
      return
    }
    if (!city.trim()) {
      toast.error("Please enter your city")
      return
    }

    if (!pincode.trim()) {
      toast.error("Please enter your pincode")
      return
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error("Pincode must be exactly 6 digits")
      return
    }

    toast.success("Order placed successfully!")
    clearCart()
    navigate("/order-success")
  }

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
    <div className="max-w-xl mx-auto w-full py-4 px-3">
      <h1 className="text-lg font-bold mb-3">Checkout</h1>

      <div className="flex flex-col gap-3">
        {/* Shipping details */}
        <Card className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <h2 className="text-xs font-semibold">Shipping Details</h2>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="fullName" className="text-xs">Full Name</Label>
              <Input
                id="fullName"
                className="h-8 text-sm"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                maxLength={10}
                className="h-8 text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-xs">Address</Label>
              <Input
                id="address"
                className="h-8 text-sm"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="city" className="text-xs">City</Label>
                <Input
                  id="city"
                  className="h-8 text-sm"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pincode" className="text-xs">Pincode</Label>
                <Input
                  id="pincode"
                  type="text"
                  maxLength={6}
                  className="h-8 text-sm"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Payment method */}
        <Card className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Wallet className="w-3.5 h-3.5 text-primary" />
            <h2 className="text-xs font-semibold">Payment Method</h2>
          </div>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col gap-1.5">
            {[
              { value: "cod", label: "Cash on Delivery" },
              { value: "upi", label: "UPI" },
              { value: "card", label: "Credit / Debit Card" },
            ].map((option) => (
              <label
                key={option.value}
                htmlFor={option.value}
                className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-sm cursor-pointer transition-colors hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                {option.label}
              </label>
            ))}
          </RadioGroup>
        </Card>

        {/* Order summary */}
        <Card className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-primary" />
            <h2 className="text-xs font-semibold">Order Summary</h2>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-md border border-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                </div>

                <div className="flex items-center gap-0.5 rounded-md border border-border">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-5 text-center text-sm">{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <p className="text-sm font-semibold w-14 text-right">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-2" />

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-base font-bold text-primary">₹{totalPrice.toFixed(2)}</p>
          </div>
        </Card>

        <Button onClick={handlePlaceOrder} className="w-full h-9">
          Place Order
        </Button>
      </div>
    </div>
  )
}

export default Checkout