/**
 * Favorites Context
 * 
 * Provides global state management for favorited products across the application.
 * 
 * - Defines a Product interface for favorite items (can be reused elsewhere).
 * - Creates a FavoritesContext to hold:
 *   - The current list of favorited products.
 *   - A function to toggle a product's favorite status.
 * 
 * - The FavoritesProvider:
 *   - Loads favorites from localStorage on initial mount.
 *   - Saves updates to favorites back to localStorage whenever the favorites list changes.
 *   - Provides favorites data and toggleFavorite function to all child components.
 * 
 * - The useFavorites hook:
 *   - Grants easy access to the favorites context.
 *   - Ensures it is only called within a valid FavoritesProvider.
 * 
 * Usage:
 * Wrap your app (or specific pages) with <FavoritesProvider> to enable favorites functionality.
 */

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
  
