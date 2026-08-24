import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/display/badge";
import { toast } from "sonner";
import {
  ShoppingCart, User, Calendar, Trash2,
  CheckCircle, Clock, Truck, XCircle, Package, IndianRupee
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
}

const initialOrders: Order[] = [
  {
    id: "ORD-9821",
    customerName: "Rahul Sharma",
    customerEmail: "rahul@gmail.com",
    date: "2026-07-24",
    items: [
      { id: 1, name: "Monstera Deliciosa", price: 899, quantity: 1 },
      { id: 2, name: "Snake Plant", price: 449, quantity: 2 }
    ],
    total: 1797,
    status: "Pending"
  },
  {
    id: "ORD-9822",
    customerName: "Priya Patel",
    customerEmail: "priya@yahoo.com",
    date: "2026-07-23",
    items: [
      { id: 3, name: "Fiddle Leaf Fig", price: 1299, quantity: 1 }
    ],
    total: 1299,
    status: "Shipped"
  },
  {
    id: "ORD-9823",
    customerName: "Amit Kumar",
    customerEmail: "amit.k@outlook.com",
    date: "2026-07-22",
    items: [
      { id: 4, name: "Golden Pothos", price: 349, quantity: 3 },
      { id: 5, name: "Echeveria Succulent Set", price: 599, quantity: 1 }
    ],
    total: 1646,
    status: "Delivered"
  },
  {
    id: "ORD-9824",
    customerName: "Sneha Reddy",
    customerEmail: "sneha.r@gmail.com",
    date: "2026-07-20",
    items: [
      { id: 6, name: "Peace Lily", price: 499, quantity: 1 }
    ],
    total: 499,
    status: "Cancelled"
  }
];

const statusConfig = {
  Pending: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  Shipped: { icon: Truck, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  Delivered: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  Cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

const Orders = () => {
  const isAdmin = localStorage.getItem("role") === "admin";
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [timeFilter, setTimeFilter] = useState<string>("All Time");
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    );
    toast.success(`Order ${id} updated to ${newStatus}`);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders((prev) => prev.filter((order) => order.id !== orderToDelete));
      toast.success(`Order ${orderToDelete} deleted`);
      setOrderToDelete(null);
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

  // Exclude cancelled orders from revenue
  const totalRevenue = filteredOrders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

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
        <div className="flex gap-1 bg-[#121212] p-1 rounded-full border border-zinc-800/60">
          {["All Time", "Last 30 Days", "Last 90 Days", "This Year"].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 cursor-pointer ${
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#121212] border border-zinc-800/50 rounded-[18px] p-4 flex items-center gap-4">
              <div className="p-2 rounded-[10px] bg-zinc-800/60">
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">{stat.label}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-[#121212] border border-zinc-800/50 rounded-[20px] overflow-hidden">
        {/* Table Header */}
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
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-500 font-medium">No orders found</p>
            <p className="text-xs text-zinc-600 mt-1">Try adjusting your time filter</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            return (
              <div
                key={order.id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors ${
                  index < filteredOrders.length - 1 ? "border-b border-zinc-800/30" : ""
                }`}
              >
                {/* Order ID */}
                <div className="col-span-1">
                  <span className="text-[12px] font-bold text-[#10b981] bg-[#10b981]/5 px-2.5 py-1 rounded-lg border border-[#10b981]/10">
                    {order.id}
                  </span>
                </div>

                {/* Customer */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{order.customerName}</p>
                    <p className="text-[11px] text-zinc-500">{order.customerEmail}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="col-span-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-[12px] text-zinc-300">
                      <span>{item.name} <span className="text-zinc-600">×{item.quantity}</span></span>
                    </div>
                  ))}
                </div>

                {/* Date */}
                <div className="col-span-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-600" />
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
                      onClick={() => setOrderToDelete(order.id)}
                      aria-label={`Delete order ${order.id}`}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Delete Order?</h3>
              <p className="text-xs text-zinc-400">
                Are you sure you want to delete order <span className="font-semibold text-white">{orderToDelete}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrder}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
