import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import { api } from "@/services/api";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "CLEAR" }
  | { type: "LOAD"; payload: WishlistItem[] };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.some((i) => i.id === action.payload.id);
      if (exists) return state;
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case "CLEAR":
      return { items: [] };
    case "LOAD":
      return { items: action.payload };
    default:
      return state;
  }
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (id: number) => boolean;
  clearWishlist: () => void;
  totalCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || undefined;
    
    // First load from localStorage for fast render
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        dispatch({ type: "LOAD", payload: JSON.parse(saved) });
      } catch {
        // ignore corrupted data
      }
    }

    // Sync from FastAPI backend database
    api.getWishlist(userEmail)
      .then((backendItems) => {
        if (backendItems && backendItems.length > 0) {
          dispatch({ type: "LOAD", payload: backendItems });
        }
      })
      .catch((err) => {
        console.warn("Could not sync wishlist from backend:", err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: WishlistItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || undefined;
    api.addToWishlist({ ...item, userEmail }).catch((err) => console.warn("Failed backend addToWishlist:", err));
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || undefined;
    api.removeFromWishlist(id, userEmail).catch((err) => console.warn("Failed backend removeFromWishlist:", err));
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR" });
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || undefined;
    api.clearWishlist(userEmail).catch((err) => console.warn("Failed backend clearWishlist:", err));
  };

  const isWishlisted = (id: number) => state.items.some((i) => i.id === id);

  const toggleItem = (item: WishlistItem) => {
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || undefined;
    if (isWishlisted(item.id)) {
      dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } });
    } else {
      dispatch({ type: "ADD_ITEM", payload: item });
    }
    api.toggleWishlist({ ...item, userEmail }).catch((err) => console.warn("Failed backend toggleWishlist:", err));
  };

  const totalCount = state.items.length;

  return (
    <WishlistContext.Provider
      value={{ items: state.items, addItem, removeItem, toggleItem, isWishlisted, clearWishlist, totalCount }}
    >
      {children}
    </WishlistContext.Provider>
  );
}


export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}