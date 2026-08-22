import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCart } from "@/pages/context/CartContext"
import { Card } from "@/components/ui/display/card"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Separator } from "@/components/ui/display/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/layout/radio-group"
import { Minus, Plus, MapPin, Wallet, ShoppingBag, Tag, X } from "lucide-react"
import { toast } from "sonner"

interface Coupon {
  type: string
  value: number
  label: string
}

const AVAILABLE_COUPONS: Record<string, Coupon> = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  SAVE20: { type: "percent", value: 20, label: "20% off" },
  FLAT50: { type: "flat", value: 50, label: "₹50 off" },
}

import { api } from "@/services/api"

const Checkout = () => {
  const { items, totalPrice, updateQuantity, clearCart } = useCart()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [submitting, setSubmitting] = useState(false)

  // controlled shipping fields
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")

  // coupon state
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<(Coupon & { code: string }) | null>(null)


  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase()
    if (!code) {
      toast.error("Please enter a coupon code")
      return
    }

    const coupon = AVAILABLE_COUPONS[code]
    if (!coupon) {
      toast.error("Invalid coupon code")
      return
    }

    setAppliedCoupon({ code, ...coupon })
    toast.success(`Coupon "${code}" applied — ${coupon.label}`)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    toast("Coupon removed")
  }

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? (totalPrice * appliedCoupon.value) / 100
      : Math.min(appliedCoupon.value, totalPrice)
    : 0

  const finalTotal = Math.max(totalPrice - discountAmount, 0)

  const handlePlaceOrder = async () => {
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

    try {
      setSubmitting(true)
      const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || `${fullName.toLowerCase().replace(/\s+/g, ".")}@example.com`
      
      const orderItems = items.map((it) => ({
        id: typeof it.id === "string" ? parseInt(it.id, 10) || Math.floor(Math.random() * 1000) : it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      }))

      await api.createOrder({
        customerName: fullName.trim(),
        customerEmail: userEmail,
        items: orderItems,
        total: finalTotal,
        status: "Pending",
      })

      toast.success("Order placed successfully!")
      clearCart()
      navigate("/order-success")
    } catch (err: unknown) {
      console.error("Failed to place order:", err)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
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
    <div className="max-w-xl mx-auto w-full py-4 sm:py-6 px-2 sm:px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Checkout</h1>

      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Shipping details */}
        <Card className="p-3.5 sm:p-4 bg-zinc-900/60 border-zinc-800">
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Shipping Details</h2>
          </div>
          <div className="flex flex-col gap-2.5">
            <div>
              <Label htmlFor="fullName" className="text-xs text-zinc-300">Full Name</Label>
              <Input
                id="fullName"
                className="h-9 text-sm bg-zinc-950/60 border-zinc-800 text-white mt-1"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs text-zinc-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                maxLength={10}
                className="h-9 text-sm bg-zinc-950/60 border-zinc-800 text-white mt-1"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit mobile number"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-xs text-zinc-300">Address</Label>
              <Input
                id="address"
                className="h-9 text-sm bg-zinc-950/60 border-zinc-800 text-white mt-1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House No. / Street"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <Label htmlFor="city" className="text-xs text-zinc-300">City</Label>
                <Input
                  id="city"
                  className="h-9 text-sm bg-zinc-950/60 border-zinc-800 text-white mt-1"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="pincode" className="text-xs text-zinc-300">Pincode</Label>
                <Input
                  id="pincode"
                  type="text"
                  maxLength={6}
                  className="h-9 text-sm bg-zinc-950/60 border-zinc-800 text-white mt-1"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="6-digit pincode"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Payment method */}
        <Card className="p-3.5 sm:p-4 bg-zinc-900/60 border-zinc-800">
          <div className="flex items-center gap-1.5 mb-3">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Payment Method</h2>
          </div>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col gap-2">
            {[
              { value: "cod", label: "Cash on Delivery" },
              { value: "upi", label: "UPI" },
              { value: "card", label: "Credit / Debit Card" },
            ].map((option) => (
              <label
                key={option.value}
                htmlFor={option.value}
                className="flex items-center gap-2.5 rounded-xl border border-zinc-800 px-3 py-2.5 text-sm cursor-pointer transition-colors hover:bg-zinc-800/40 text-zinc-200 has-[:checked]:border-emerald-500/50 has-[:checked]:bg-emerald-500/10 has-[:checked]:text-emerald-300"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                {option.label}
              </label>
            ))}
          </RadioGroup>
        </Card>

        {/* Coupon code */}
        <Card className="p-3.5 sm:p-4 bg-zinc-900/60 border-zinc-800">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Tag className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Have a coupon?</h2>
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-semibold text-emerald-300 truncate">{appliedCoupon.code}</span>
                <span className="text-xs text-zinc-400">({appliedCoupon.label})</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-zinc-400 hover:text-white"
                onClick={handleRemoveCoupon}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter coupon code (e.g. SAVE10)"
                className="h-9 text-sm uppercase bg-zinc-950/60 border-zinc-800 text-white"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              <Button className="h-9 shrink-0 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4" onClick={handleApplyCoupon}>
                Apply
              </Button>
            </div>
          )}
        </Card>

        {/* Order summary */}
        <Card className="p-3.5 sm:p-4 bg-zinc-900/60 border-zinc-800">
          <div className="flex items-center gap-1.5 mb-3">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Order Summary</h2>
          </div>

          <div className="flex flex-col gap-2.5">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2.5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-11 h-11 object-cover rounded-lg border border-zinc-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-xs text-zinc-400">₹{item.price.toFixed(2)} each</p>
                </div>

                <div className="flex items-center gap-0.5 rounded-lg border border-zinc-800 bg-zinc-950/40 p-0.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-zinc-400 hover:text-white"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-5 text-center text-xs font-bold text-white">{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-zinc-400 hover:text-white"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <p className="text-sm font-bold text-emerald-400 w-16 text-right shrink-0">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-3 bg-zinc-800" />

          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">Subtotal</p>
            <p className="text-sm font-medium text-white">₹{totalPrice.toFixed(2)}</p>
          </div>

          {appliedCoupon && (
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-emerald-400">Discount ({appliedCoupon.code})</p>
              <p className="text-sm font-bold text-emerald-400">-₹{discountAmount.toFixed(2)}</p>
            </div>
          )}

          <Separator className="my-3 bg-zinc-800" />

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-300">Total Amount</p>
            <p className="text-lg font-bold text-emerald-400">₹{finalTotal.toFixed(2)}</p>
          </div>
        </Card>

        <Button
          onClick={handlePlaceOrder}
          disabled={submitting}
          className="w-full h-11 text-base font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl cursor-pointer"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </Button>
      </div>
    </div>
  )
}

export default Checkout