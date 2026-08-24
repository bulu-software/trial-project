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

  console.groupCollapsed(`%c[API CALL] ${method} ${endpoint}`, "color: #3b82f6; font-weight: bold;");
  if (options.body) {
    try {
      const parsed = JSON.parse(options.body as string);
      console.log("📤 Request Body:", sanitizeLogData(parsed));
    } catch {
      console.log("📤 Request Body:", options.body);
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Send & receive HttpOnly Cookies
    });

    const result = await res.json();

    if (!res.ok) {
      console.error(`❌ [API ERROR ${res.status}] ${endpoint}:`, result);
      console.groupEnd();
      throw new Error(result.detail || "Request failed");
    }

    console.log(`✅ [API RESPONSE ${res.status}] ${endpoint}:`, result);
    console.groupEnd();
    return result as T;
  } catch (error) {
    if (!(error instanceof Error && error.message)) {
      console.error(`❌ [API FAILED] ${endpoint}:`, error);
      console.groupEnd();
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

  async forgotPassword(data: { email: string; new_password?: string }) {
    return request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    return request<{ message: string; verified?: boolean }>("/auth/verify-otp", {
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

  async resetPassword(data: { token: string; new_password: string }) {
    return request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async getCustomers(token?: string): Promise<{ id: number; name: string; email: string; role: string; phone?: string; address?: string; joined?: string; orders?: number }[]> {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return request("/auth/customers", { headers });
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
};

