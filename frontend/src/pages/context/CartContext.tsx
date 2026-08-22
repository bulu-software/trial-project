import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import { api } from "@/services/api";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR" }
  | { type: "LOAD"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case "UPDATE_QUANTITY":
      return {
        items: state.items
          .map((i) =>
            i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return { items: [] };
    case "LOAD":
      return { items: action.payload };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || undefined;
    
    // First load from localStorage for instant render
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        dispatch({ type: "LOAD", payload: JSON.parse(saved) });
      } catch {
        // ignore corrupted data
      }
    }

    // Then sync from FastAPI backend database
    api.getCart(userEmail)
      .then((backendItems) => {
        if (backendItems && backendItems.length > 0) {
          dispatch({ type: "LOAD", payload: backendItems });
        }
      })
      .catch((err) => {
        console.warn("Could not sync cart from backend:", err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || undefined;
    api.addToCart({ ...item, quantity: 1, userEmail }).catch((err) => console.warn("Failed backend addToCart:", err));
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || undefined;
    api.removeFromCart(id, userEmail).catch((err) => console.warn("Failed backend removeFromCart:", err));
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || undefined;
    api.updateCartQuantity(id, quantity, userEmail).catch((err) => console.warn("Failed backend updateCartQuantity:", err));
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR" });
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || undefined;
    api.clearCart(userEmail).catch((err) => console.warn("Failed backend clearCart:", err));
  };

  const totalCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, totalCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}