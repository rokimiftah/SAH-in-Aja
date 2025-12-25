import { useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

export function useProducts() {
  const products = useQuery(api.products.getMyProducts);
  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);

  return {
    products: products ?? [],
    isLoading: products === undefined,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

export function useIngredients() {
  const ingredients = useQuery(api.ingredients.getMyIngredients);
  const createIngredient = useMutation(api.ingredients.createIngredient);
  const updateIngredient = useMutation(api.ingredients.updateIngredient);
  const deleteIngredient = useMutation(api.ingredients.deleteIngredient);

  return {
    ingredients: ingredients ?? [],
    isLoading: ingredients === undefined,
    createIngredient,
    updateIngredient,
    deleteIngredient,
  };
}

export function useTraceability() {
  const matrix = useQuery(api.traceability.getTraceabilityMatrix);
  const addMapping = useMutation(api.traceability.addMapping);
  const removeMapping = useMutation(api.traceability.removeMapping);
  const updateProductIngredients = useMutation(api.traceability.updateProductIngredients);

  return {
    matrix: matrix ?? { products: [], ingredients: [], mappings: [] },
    isLoading: matrix === undefined,
    addMapping,
    removeMapping,
    updateProductIngredients,
  };
}
