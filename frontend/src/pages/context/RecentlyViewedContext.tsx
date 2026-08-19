import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_ITEMS = 10;

export const RecentlyViewedProvider = ({ children }: { children: ReactNode }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    const stored = localStorage.getItem("recentlyViewed");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      return updated;
    });
  };

  const clearRecentlyViewed = () => setRecentlyViewed([]);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return context;
};