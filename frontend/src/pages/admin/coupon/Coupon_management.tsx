import { useState } from "react"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Separator } from "@/components/ui/display/separator"
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Percent,
  IndianRupee,
  CalendarClock,
} from "lucide-react"
import { toast } from "sonner"

interface Coupon {
  id: number
  code: string
  type: "percentage" | "flat"
  value: number
  minOrderAmount: number
  expiryDate: string
  active: boolean
}

const initialCoupons: Coupon[] = [
  {
    id: 1,
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrderAmount: 499,
    expiryDate: "2026-12-31",
    active: true,
  },
  {
    id: 2,
    code: "FLAT100",
    type: "flat",
    value: 100,
    minOrderAmount: 999,
    expiryDate: "2026-09-30",
    active: true,
  },
  {
    id: 3,
    code: "SUMMER50",
    type: "percentage",
    value: 50,
    minOrderAmount: 1999,
    expiryDate: "2026-08-15",
    active: false,
  },
]

const emptyForm = {
  code: "",
  type: "percentage" as "percentage" | "flat",
  value: "",
  minOrderAmount: "",
  expiryDate: "",
}

const Coupon_management = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (coupon: Coupon) => {
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      minOrderAmount: String(coupon.minOrderAmount),
      expiryDate: coupon.expiryDate,
    })
    setEditingId(coupon.id)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id))
    toast.success("Coupon deleted")
  }

  const toggleActive = (id: number) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    )
  }

  const handleSubmit = () => {
    if (!form.code.trim() || !form.value || !form.minOrderAmount || !form.expiryDate) {
      toast.error("Please fill all fields")
      return
    }

    if (editingId) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                code: form.code.toUpperCase(),
                type: form.type,
                value: Number(form.value),
                minOrderAmount: Number(form.minOrderAmount),
                expiryDate: form.expiryDate,
              }
            : c
        )
      )
      toast.success("Coupon updated")
    } else {
      const newCoupon: Coupon = {
        id: Date.now(),
        code: form.code.toUpperCase(),
        type: form.type,
        value: Number(form.value),
        minOrderAmount: Number(form.minOrderAmount),
        expiryDate: form.expiryDate,
        active: true,
      }
      setCoupons((prev) => [newCoupon, ...prev])
      toast.success("Coupon created")
    }

    resetForm()
  }

  const isExpired = (date: string) => new Date(date) < new Date()

  return (
    <div className="min-h-[80vh] bg-zinc-950 text-white py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
              <Tag className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Coupon Management</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Create and manage discount coupons</p>
            </div>
          </div>

          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl flex items-center gap-2 cursor-pointer self-start sm:self-auto text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" />
              New Coupon
            </Button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                {editingId ? "Edit Coupon" : "Create Coupon"}
              </h2>
              <button
                onClick={resetForm}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Coupon Code</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Discount Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "flat" })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (Rs.)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  Discount Value {form.type === "percentage" ? "(%)" : "(Rs.)"}
                </label>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder={form.type === "percentage" ? "e.g. 10" : "e.g. 100"}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Min. Order Amount (Rs.)</label>
                <input
                  type="number"
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                  placeholder="e.g. 499"
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-zinc-400">Expiry Date</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={resetForm}
                variant="outline"
                className="border-zinc-800 text-zinc-400 hover:text-white rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl cursor-pointer"
              >
                {editingId ? "Update Coupon" : "Create Coupon"}
              </Button>
            </div>
          </div>
        )}

        <Separator className="bg-zinc-800" />

        {/* Coupon List */}
        {coupons.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <Tag className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p>No coupons created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon) => {
              const expired = isExpired(coupon.expiryDate)
              return (
                <div
                  key={coupon.id}
                  className={`bg-zinc-900/40 border rounded-2xl p-5 space-y-3 backdrop-blur-md transition-all duration-200 ${
                    coupon.active && !expired
                      ? "border-zinc-800"
                      : "border-zinc-800/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        {coupon.type === "percentage" ? (
                          <Percent className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className="font-mono font-bold text-white tracking-wide">
                        {coupon.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/60 cursor-pointer transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800/60 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-zinc-300">
                    {coupon.type === "percentage"
                      ? `${coupon.value}% off`
                      : `Rs. ${coupon.value} off`}{" "}
                    on orders above Rs. {coupon.minOrderAmount}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <CalendarClock className="w-3.5 h-3.5" />
                      <span>
                        {expired ? "Expired on" : "Expires on"} {coupon.expiryDate}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleActive(coupon.id)}
                      disabled={expired}
                      className="cursor-pointer disabled:cursor-not-allowed"
                    >
                      {expired ? (
                        <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/10 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                          Expired
                        </Badge>
                      ) : coupon.active ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                          Inactive
                        </Badge>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Coupon_management