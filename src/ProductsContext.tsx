import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "./supabase";

export type DbVariant = { label: string; price: number };
export type DbProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  variants: DbVariant[];
  image: string;
};

const ProductsContext = createContext<DbProduct[]>([]);
export const useProducts = () => useContext(ProductsContext);

export function ProductsProvider({ fallback, children }: { fallback: DbProduct[]; children: ReactNode }) {
  const [items, setItems] = useState<DbProduct[]>(fallback);

  useEffect(() => {
    supabase
      .from("products")
      .select("id,name,category,description,variants,image")
      .eq("active", true)
      .order("sort_order")
      .then(({ data, error }) => {
        if (error) console.error("Supabase products error:", error.message);
        else if (data && data.length > 0) setItems(data as DbProduct[]);
      });
  }, []);

  return <ProductsContext.Provider value={items}>{children}</ProductsContext.Provider>;
}