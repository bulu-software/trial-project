import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";

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
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        dispatch({ type: "LOAD", payload: JSON.parse(saved) });
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: WishlistItem) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (id: number) => dispatch({ type: "REMOVE_ITEM", payload: { id } });
  const clearWishlist = () => dispatch({ type: "CLEAR" });

  const isWishlisted = (id: number) => state.items.some((i) => i.id === id);

  const toggleItem = (item: WishlistItem) => {
    if (isWishlisted(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
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