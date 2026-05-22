import { api } from "../../services/api";

export const getMenuItems = async () => {
  const response = await api.get("/menu/items");
  return response.data.data || response.data;
};

export const getIngredients = async () => {
  const response = await api.get("/inventory/ingredients");
  return response.data.data || response.data;
};

export const createRecipe = async (payload: {
  menuItemId: string;
  ingredients: {
    ingredientId: string;
    quantity: number;
  }[];
}) => {
  const response = await api.post("/recipes", payload);
  return response.data;
};

export const getRecipes = async () => {
  const response = await api.get("/recipes");
  return response.data.data || response.data;
};