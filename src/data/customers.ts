export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  joined: string;
  orders: number;
  status: "Active" | "Blocked";
}

export const customers: Customer[] = [
  { id: 1, name: "Aarav Shah", email: "aarav.shah@example.com", phone: "9876543210", joined: "2025-03-12", orders: 5, status: "Active" },
  { id: 2, name: "Priya Mehta", email: "priya.mehta@example.com", phone: "9823456712", joined: "2025-05-01", orders: 2, status: "Active" },
  { id: 3, name: "Rohan Desai", email: "rohan.desai@example.com", phone: "9765432190", joined: "2025-01-20", orders: 8, status: "Blocked" },
  { id: 4, name: "Neha Patel", email: "neha.patel@example.com", phone: "9834567891", joined: "2025-06-15", orders: 1, status: "Active" },
  { id: 5, name: "Kunal Joshi", email: "kunal.joshi@example.com", phone: "9812345678", joined: "2024-11-30", orders: 12, status: "Active" },
];