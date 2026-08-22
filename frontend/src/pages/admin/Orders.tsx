import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/display/badge";
import { toast } from "sonner";
import {
  ShoppingCart, User, Calendar, Trash2,
  CheckCircle, Clock, Truck, XCircle, Package, IndianRupee, Loader2
} from "lucide-react";
import { api, type Order } from "@/services/api";

const statusConfig = {
  Pending: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  Shipped: { icon: Truck, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  Delivered: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  Cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

const Orders = () => {
  const isAdmin = localStorage.getItem("role") === "admin";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<string>("All Time");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err: unknown) {
      console.error("Failed to load orders:", err);
      toast.error("Could not fetch orders from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Order["status"]) => {
    try {
      await api.updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
      );
      toast.success(`Order ${id} updated to ${newStatus}`);
    } catch (err: unknown) {
      console.error("Failed to update status:", err);
      toast.error(`Failed to update status for order ${id}`);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await api.deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order.id !== id));
      toast.success(`Order ${id} deleted`);
    } catch (err: unknown) {
      console.error("Failed to delete order:", err);
      toast.error(`Failed to delete order ${id}`);
    }
  };


  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      switch (timeFilter) {
        case "Last 30 Days": {
          const d = new Date(now);
          d.setDate(now.getDate() - 30);
          return orderDate >= d;
        }
        case "Last 90 Days": {
          const d = new Date(now);
          d.setDate(now.getDate() - 90);
          return orderDate >= d;
        }
        case "This Year":
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [orders, timeFilter]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = filteredOrders.filter((o) => o.status === "Pending").length;
  const deliveredCount = filteredOrders.filter((o) => o.status === "Delivered").length;

  const stats = [
    { label: "Total Orders", value: filteredOrders.length, icon: Package, color: "text-emerald-400" },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-400" },
    { label: "Pending", value: pendingCount, icon: Clock, color: "text-yellow-400" },
    { label: "Delivered", value: deliveredCount, icon: CheckCircle, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-[14px] bg-[#064e3b]/40">
            <ShoppingCart className="w-6 h-6 text-[#10b981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Manage Orders</h1>
            <p className="text-sm text-zinc-400">Track and manage all customer orders</p>
          </div>
        </div>

      {/* Time Filter */}
        <div className="flex gap-1 bg-[#121212] p-1 rounded-2xl sm:rounded-full border border-zinc-800/60 overflow-x-auto max-w-full">
          {["All Time", "Last 30 Days", "Last 90 Days", "This Year"].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[12px] font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                timeFilter === filter
                  ? "bg-[#10b981] text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#121212] border border-zinc-800/50 rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="p-2 rounded-xl bg-zinc-800/60 shrink-0">
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 truncate">{stat.label}</p>
                <p className="text-base sm:text-lg font-bold text-white truncate">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Container */}
      <div className="bg-[#121212] border border-zinc-800/50 rounded-2xl overflow-hidden">
        {/* Table Header (Desktop Only) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-800/50 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          <div className="col-span-1">Order</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Items</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-1 text-center">Status</div>
          {isAdmin && <div className="col-span-2 text-right">Actions</div>}
        </div>

        {/* Order Rows */}
        {loading ? (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#10b981] animate-spin mb-3" />
            <p className="text-sm text-zinc-400 font-medium">Loading orders from database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-500 font-medium">No orders found</p>
            <p className="text-xs text-zinc-600 mt-1">Try adjusting your time filter</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => {
            const config = statusConfig[order.status] || statusConfig["Pending"];
            const StatusIcon = config.icon;
            return (
              <div key={order.id} className={index < filteredOrders.length - 1 ? "border-b border-zinc-800/30" : ""}>
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors">
                  {/* Order ID */}
                  <div className="col-span-1">
                    <span className="text-[12px] font-bold text-[#10b981] bg-[#10b981]/5 px-2.5 py-1 rounded-lg border border-[#10b981]/10">
                      {order.id}
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-white truncate">{order.customerName}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{order.customerEmail}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="col-span-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-[12px] text-zinc-300 truncate">
                        <span className="truncate">{item.name} <span className="text-zinc-600">×{item.quantity}</span></span>
                      </div>
                    ))}
                  </div>

                  {/* Date */}
                  <div className="col-span-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span className="text-[12px] text-zinc-400">{order.date.slice(5)}</span>
                  </div>

                  {/* Total */}
                  <div className="col-span-1 text-right">
                    <span className="text-[13px] font-bold text-white">₹{order.total.toLocaleString()}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex justify-center">
                    <Badge className={`${config.bg} ${config.color} ${config.border} flex items-center gap-1 text-[10px] py-0.5 px-2.5 rounded-full`}>
                      <StatusIcon className="w-3 h-3" />
                      {order.status}
                    </Badge>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                        className="h-7 text-[11px] bg-zinc-900 border border-zinc-700/50 rounded-lg text-white px-2 focus:outline-none focus:border-[#10b981]/50 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Card View (< md) */}
                <div className="flex md:hidden flex-col gap-3 p-4 hover:bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#10b981] bg-[#10b981]/5 px-2.5 py-1 rounded-lg border border-[#10b981]/10">
                      {order.id}
                    </span>
                    <Badge className={`${config.bg} ${config.color} ${config.border} flex items-center gap-1 text-[10px] py-0.5 px-2 rounded-full`}>
                      <StatusIcon className="w-3 h-3" />
                      {order.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{order.customerName}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{order.customerEmail}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-[11px] text-zinc-300">
                        <span className="truncate">{item.name}</span>
                        <span className="text-zinc-500 shrink-0 ml-2">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      <span>{order.date}</span>
                    </div>
                    <span className="font-bold text-white text-sm">₹{order.total.toLocaleString()}</span>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/40">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                        className="flex-1 h-8 text-xs bg-zinc-900 border border-zinc-700/50 rounded-lg text-white px-2 focus:outline-none focus:border-[#10b981]/50 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
