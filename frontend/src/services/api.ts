const API_BASE_URL = "http://localhost:8000/api";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
  phone?: string | null;
  address?: string | null;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

// Helper function to sanitize sensitive fields before logging
function sanitizeLogData(data: unknown): unknown {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map(sanitizeLogData);

  const sanitized: Record<string, unknown> = { ...(data as Record<string, unknown>) };
  const sensitiveKeys = ["password", "current_password", "new_password", "confirmPassword", "token"];
  
  for (const key of sensitiveKeys) {
    if (key in sanitized) {
      sanitized[key] = "••••••••";
    }
  }
  return sanitized;
}

// Helper function to log API requests and responses directly to the browser inspect console
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || "GET";

  // Build headers and attach Authorization Bearer token as backup if present
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  const storedToken = localStorage.getItem("token");
  if (storedToken && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${storedToken}`;
  }

  let requestPayload: unknown = undefined;
  if (options.body) {
    try {
      requestPayload = sanitizeLogData(JSON.parse(options.body as string));
    } catch {
      requestPayload = options.body;
    }
  }

  console.log(
    `%c[API CALL] ${method} ${endpoint}`,
    "background: #1e293b; color: #38bdf8; font-weight: bold; padding: 3px 8px; border-radius: 4px;",
    requestPayload ? { body: requestPayload } : ""
  );

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Send & receive HttpOnly Cookies
    });

    const result = await res.json();

    if (!res.ok) {
      console.error(
        `%c[API ERROR ${res.status}] ${method} ${endpoint}`,
        "background: #450a0a; color: #f87171; font-weight: bold; padding: 3px 8px; border-radius: 4px;",
        result
      );
      throw new Error(result.detail || "Request failed");
    }

    console.log(
      `%c[API RESPONSE ${res.status}] ${method} ${endpoint}`,
      "background: #052e16; color: #4ade80; font-weight: bold; padding: 3px 8px; border-radius: 4px;",
      result
    );
    return result as T;
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      const friendlyError = "Unable to connect to backend server. Please ensure FastAPI server is running on http://localhost:8000.";
      console.error(
        `%c[API CONNECTION ERROR] ${method} ${endpoint}`,
        "background: #450a0a; color: #f87171; font-weight: bold; padding: 3px 8px; border-radius: 4px;",
        friendlyError
      );
      throw new Error(friendlyError);
    }
    if (!(error instanceof Error && error.message)) {
      console.error(
        `%c[API FAILED] ${method} ${endpoint}`,
        "background: #450a0a; color: #f87171; font-weight: bold; padding: 3px 8px; border-radius: 4px;",
        error
      );
    }
    throw error;
  }
}

export const api = {
  // Authentication
  async register(data: { name: string; email: string; password: string; role?: string; phone?: string; address?: string }): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<{ message: string }> {
    return request<{ message: string }>("/auth/logout", {
      method: "POST",
    });
  },

  async getProfile(token?: string): Promise<UserProfile> {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return request<UserProfile>("/auth/profile", {
      headers,
    });
  },

  async updateProfile(data: { name?: string; phone?: string; address?: string }): Promise<UserProfile> {
    return request<UserProfile>("/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async changePassword(data: { current_password: string; new_password: string }, token?: string) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return request<{ message: string }>("/auth/change-password", {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
  },

  async sendOtp(data: { email: string }) {
    return request<{ message: string }>("/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async verifyOtp(data: { email: string; otp: string }) {
    return request<{ message: string; verified: boolean }>("/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async resetPasswordOtp(data: { email: string; otp: string; new_password: string }) {
    return request<{ message: string }>("/auth/reset-password-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async forgotPassword(data: { email: string }) {
    return request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async resetPassword(data: { token: string; new_password: string }) {
    return request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  async getCustomers() {
    return request<Array<{
      id: number;
      name: string;
      email: string;
      role: string;
      phone?: string;
      address?: string;
      joined: string;
      orders: number;
    }>>("/auth/customers");
  },

  // Products
  async getProducts(category?: string) {
    const endpoint = category && category !== "All"
      ? `/products?category=${encodeURIComponent(category)}`
      : `/products`;
    return request(endpoint);
  },

  async getProduct(productId: number | string) {
    return request(`/products/${productId}`);
  },

  async createProduct(data: {
    name: string;
    category: string;
    price: number;
    image: string;
    rating?: number;
    reviews?: number;
    badge?: string;
    features?: string[];
  }) {
    return request("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async updateProduct(productId: number | string, data: {
    name?: string;
    category?: string;
    price?: number;
    image?: string;
    rating?: number;
    reviews?: number;
    badge?: string;
    features?: string[];
  }) {
    return request(`/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(productId: number | string) {
    return request(`/products/${productId}`, {
      method: "DELETE",
    });
  },

  // Orders
  async getOrders(customerEmail?: string): Promise<Order[]> {
    const endpoint = customerEmail ? `/orders?customer_email=${encodeURIComponent(customerEmail)}` : "/orders";
    return request<Order[]>(endpoint);
  },

  async getOrder(orderId: string): Promise<Order> {
    return request<Order>(`/orders/${orderId}`);
  },

  async createOrder(data: CreateOrderPayload): Promise<Order> {
    return request<Order>("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order> {
    return request<Order>(`/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  },

  async deleteOrder(orderId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/orders/${orderId}`, {
      method: "DELETE",
    });
  },

  // Cart
  async getCart(userEmail?: string): Promise<CartApiItem[]> {
    const endpoint = userEmail ? `/cart?user_email=${encodeURIComponent(userEmail)}` : "/cart";
    return request<CartApiItem[]>(endpoint);
  },

  async addToCart(item: { id: number; name: string; price: number; image: string; quantity?: number; userEmail?: string }): Promise<CartApiItem> {
    return request<CartApiItem>("/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  },

  async updateCartQuantity(productId: number, quantity: number, userEmail?: string): Promise<CartApiItem[]> {
    const endpoint = userEmail ? `/cart/${productId}?user_email=${encodeURIComponent(userEmail)}` : `/cart/${productId}`;
    return request<CartApiItem[]>(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
  },

  async removeFromCart(productId: number, userEmail?: string): Promise<{ message: string }> {
    const endpoint = userEmail ? `/cart/${productId}?user_email=${encodeURIComponent(userEmail)}` : `/cart/${productId}`;
    return request<{ message: string }>(endpoint, {
      method: "DELETE",
    });
  },

  async clearCart(userEmail?: string): Promise<{ message: string }> {
    const endpoint = userEmail ? `/cart?user_email=${encodeURIComponent(userEmail)}` : "/cart";
    return request<{ message: string }>(endpoint, {
      method: "DELETE",
    });
  },

  // Wishlist
  async getWishlist(userEmail?: string): Promise<WishlistApiItem[]> {
    const endpoint = userEmail ? `/wishlist?user_email=${encodeURIComponent(userEmail)}` : "/wishlist";
    return request<WishlistApiItem[]>(endpoint);
  },

  async addToWishlist(item: { id: number; name: string; price: number; image: string; userEmail?: string }): Promise<WishlistApiItem> {
    return request<WishlistApiItem>("/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  },

  async toggleWishlist(item: { id: number; name: string; price: number; image: string; userEmail?: string }): Promise<{ wishlisted: boolean; message: string }> {
    return request<{ wishlisted: boolean; message: string }>("/wishlist/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  },

  async removeFromWishlist(productId: number, userEmail?: string): Promise<{ message: string }> {
    const endpoint = userEmail ? `/wishlist/${productId}?user_email=${encodeURIComponent(userEmail)}` : `/wishlist/${productId}`;
    return request<{ message: string }>(endpoint, {
      method: "DELETE",
    });
  },

  async clearWishlist(userEmail?: string): Promise<{ message: string }> {
    const endpoint = userEmail ? `/wishlist?user_email=${encodeURIComponent(userEmail)}` : "/wishlist";
    return request<{ message: string }>(endpoint, {
      method: "DELETE",
    });
  },
};

export interface CartApiItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface WishlistApiItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
}

export interface CreateOrderPayload {
  id?: string;
  customerName: string;
  customerEmail: string;
  date?: string;
  items: OrderItem[];
  total: number;
  status?: string;
}



