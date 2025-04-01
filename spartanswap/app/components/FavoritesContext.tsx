"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// You can reuse your Product interface (or import it if it's defined elsewhere)
export interface Product {
  id: number;
  name: string;
  price: number;
  orders: number;
  image: string;
  type: string;
  color: string;
  category: string;
  description?: string;
  isCustom?: boolean;
}

interface FavoritesContextProps {
  favorites: Product[];
  toggleFavorite: (item: Product) => void;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Load favorites from localStorage on mount.
  useEffect(() => {
    const favData = localStorage.getItem("favorites");
    if (favData) {
      try {
        setFavorites(JSON.parse(favData));
      } catch (error) {
        console.error("Error parsing favorites from localStorage", error);
      }
    }
  }, []);

  // Persist favorites to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (item: Product) => {
    setFavorites((prev) => {
      const isFavorited = prev.some((fav) => fav.id === item.id);
      return isFavorited
        ? prev.filter((fav) => fav.id !== item.id)
        : [...prev, item];
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
      throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
  };
  
