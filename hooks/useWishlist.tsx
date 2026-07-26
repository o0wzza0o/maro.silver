"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { Product } from "@/types";
import { useLocalStorage } from "./useLocalStorage";

interface WishlistContextType {
  items: Product[];
  isHydrated: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems, isHydrated] = useLocalStorage<Product[]>(
    "maro-silver-wishlist",
    []
  );

  const addItem = useCallback(
    (product: Product) => {
      setItems((prev) => {
        if (prev.some((p) => p.id === product.id)) return prev;
        return [...prev, product];
      });
    },
    [setItems]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((p) => p.id !== productId));
    },
    [setItems]
  );

  const toggleItem = useCallback(
    (product: Product) => {
      setItems((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        if (exists) {
          return prev.filter((p) => p.id !== product.id);
        }
        return [...prev, product];
      });
    },
    [setItems]
  );

  const isInWishlist = useCallback(
    (productId: string) => items.some((p) => p.id === productId),
    [items]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const value = useMemo(
    () => ({
      items,
      isHydrated,
      addItem,
      removeItem,
      toggleItem,
      isInWishlist,
      clearWishlist,
    }),
    [
      items,
      isHydrated,
      addItem,
      removeItem,
      toggleItem,
      isInWishlist,
      clearWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
