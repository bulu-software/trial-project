export type OrderStatus = "Delivered" | "Shipped" | "Cancelled"

export interface OrderItem {
  id: number
  name: string
  qty: number
  price: number
  rating: number
  review: string
}

export interface Order {
  id: string
  date: string
  status: OrderStatus
  currentStep: number
  total: number
  items: OrderItem[]
  productName: string
  address: string
  paymentMethod: string
}

export const dummyOrders: Order[] = [
  {
    id: "ORD483920",
    date: "24 Jul 2026",
    status: "Delivered",
    currentStep: 4,
    total: 899,
    productName: "Monstera Deliciosa",
    address: "12 Green Villa, MG Road, Valsad, Gujarat - 396001",
    paymentMethod: "Cash on Delivery",
    items: [
      { id: 1, name: "Monstera Deliciosa", qty: 1, price: 599, rating: 0, review: "" },
      { id: 2, name: "Ceramic Pot - White", qty: 1, price: 300, rating: 0, review: "" },
    ],
  },
  {
    id: "ORD483765",
    date: "18 Jul 2026",
    status: "Shipped",
    currentStep: 2,
    total: 1499,
    productName: "Snake Plant",
    address: "12 Green Villa, MG Road, Valsad, Gujarat - 396001",
    paymentMethod: "UPI",
    items: [
      { id: 1, name: "Snake Plant", qty: 2, price: 599, rating: 0, review: "" },
      { id: 2, name: "Terracotta Pot", qty: 1, price: 301, rating: 0, review: "" },
    ],
  },
  {
    id: "ORD483210",
    date: "05 Jul 2026",
    status: "Cancelled",
    currentStep: 0,
    total: 499,
    productName: "Golden Pothos",
    address: "12 Green Villa, MG Road, Valsad, Gujarat - 396001",
    paymentMethod: "Cash on Delivery",
    items: [{ id: 1, name: "Golden Pothos", qty: 1, price: 499, rating: 0, review: "" }],
  },
]