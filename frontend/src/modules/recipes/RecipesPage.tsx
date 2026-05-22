import { useEffect, useState } from "react";
import {
  ChefHat,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

import {
  createRecipe,
  getIngredients,
  getMenuItems,
  getRecipes,
} from "./recipes.service";

type MenuItem = {
  id: string;
  name: string;
  price: number;
};

type Ingredient = {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  costPerUnit?: number;
};

type RecipeIngredientInput = {
  ingredientId: string;
  quantity: number;
};

const RecipesPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);

  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [recipeIngredients, setRecipeIngredients] =
    useState<RecipeIngredientInput[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        menuData,
        ingredientData,
        recipeData,
      ] = await Promise.all([
        getMenuItems(),
        getIngredients(),
        getRecipes(),
      ]);

      setMenuItems(Array.isArray(menuData) ? menuData : []);
      setIngredients(Array.isArray(ingredientData) ? ingredientData : []);
      setRecipes(Array.isArray(recipeData) ? recipeData : []);
    } catch (error) {
      console.error("Failed to load recipe data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addIngredient = () => {
    if (!selectedIngredientId || !quantity) {
      alert("Please select ingredient and enter quantity.");
      return;
    }

    const exists = recipeIngredients.some(
      (item) => item.ingredientId === selectedIngredientId
    );

    if (exists) {
      alert("Ingredient already added to this recipe.");
      return;
    }

    setRecipeIngredients((prev) => [
      ...prev,
      {
        ingredientId: selectedIngredientId,
        quantity: Number(quantity),
      },
    ]);

    setSelectedIngredientId("");
    setQuantity("");
  };

  const removeIngredient = (ingredientId: string) => {
    setRecipeIngredients((prev) =>
      prev.filter((item) => item.ingredientId !== ingredientId)
    );
  };

  const getIngredientById = (id: string) => {
    return ingredients.find((ingredient) => ingredient.id === id);
  };

  const calculateEstimatedCost = () => {
    return recipeIngredients.reduce((sum, item) => {
      const ingredient = getIngredientById(item.ingredientId);

      const costPerUnit = Number(ingredient?.costPerUnit || 0);

      return sum + costPerUnit * item.quantity;
    }, 0);
  };

  const selectedMenuItem = menuItems.find(
    (item) => item.id === selectedMenuItemId
  );

  const estimatedCost = calculateEstimatedCost();

  const estimatedProfit = selectedMenuItem
    ? Number(selectedMenuItem.price) - estimatedCost
    : 0;

  const foodCostPercentage =
    selectedMenuItem && Number(selectedMenuItem.price) > 0
      ? (estimatedCost / Number(selectedMenuItem.price)) * 100
      : 0;

  const saveRecipe = async () => {
    if (!selectedMenuItemId) {
      alert("Please select a menu item.");
      return;
    }

    if (recipeIngredients.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }

    try {
      setSaving(true);

      await createRecipe({
        menuItemId: selectedMenuItemId,
        ingredients: recipeIngredients,
      });

      alert("Recipe saved successfully.");

      setSelectedMenuItemId("");
      setRecipeIngredients([]);

      await loadData();
    } catch (error: any) {
      console.error("Failed to save recipe", error);

      alert(
        error?.response?.data?.message ||
          "Failed to save recipe."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Loading recipes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <ChefHat size={26} />
          Recipe Management
        </h1>

        <p className="text-sm text-slate-500">
          Link menu items with ingredients to enable costing, inventory deduction, and analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            Create Recipe
          </h2>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Menu Item
            </label>

            <select
              value={selectedMenuItemId}
              onChange={(event) =>
                setSelectedMenuItemId(event.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">Select menu item</option>

              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — ₹{Number(item.price).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Ingredient
              </label>

              <select
                value={selectedIngredientId}
                onChange={(event) =>
                  setSelectedIngredientId(event.target.value)
                }
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              >
                <option value="">Select ingredient</option>

                {ingredients.map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.name} ({ingredient.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Quantity Used
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                placeholder="0.00"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>

          <button
            onClick={addIngredient}
            className="mt-4 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
          >
            <Plus size={18} />
            Add Ingredient
          </button>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2">Ingredient</th>
                  <th className="py-2">Unit</th>
                  <th className="py-2">Qty Used</th>
                  <th className="py-2">Cost / Unit</th>
                  <th className="py-2">Estimated Cost</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {recipeIngredients.map((item) => {
                  const ingredient = getIngredientById(item.ingredientId);

                  const cost = Number(ingredient?.costPerUnit || 0) * item.quantity;

                  return (
                    <tr key={item.ingredientId} className="border-b">
                      <td className="py-3 font-medium">
                        {ingredient?.name || "Unknown"}
                      </td>

                      <td className="py-3">
                        {ingredient?.unit || "-"}
                      </td>

                      <td className="py-3">
                        {item.quantity}
                      </td>

                      <td className="py-3">
                        ₹{Number(ingredient?.costPerUnit || 0).toFixed(2)}
                      </td>

                      <td className="py-3">
                        ₹{cost.toFixed(2)}
                      </td>

                      <td className="py-3 text-right">
                        <button
                          onClick={() =>
                            removeIngredient(item.ingredientId)
                          }
                          className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {recipeIngredients.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-5 text-slate-500"
                    >
                      No ingredients added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button
            onClick={saveRecipe}
            disabled={saving}
            className="mt-5 flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Recipe"}
          </button>
        </section>

        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            Cost Preview
          </h2>

          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Selling Price
              </p>

              <p className="text-2xl font-bold">
                ₹{Number(selectedMenuItem?.price || 0).toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Recipe Cost
              </p>

              <p className="text-2xl font-bold">
                ₹{estimatedCost.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Estimated Profit
              </p>

              <p className="text-2xl font-bold">
                ₹{estimatedProfit.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Food Cost %
              </p>

              <p className="text-2xl font-bold">
                {foodCostPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          Existing Recipes
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2">Menu Item</th>
                <th className="py-2">Ingredients</th>
                <th className="py-2">Created</th>
              </tr>
            </thead>

            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="border-b">
                  <td className="py-3 font-medium">
                    {recipe.menuItem?.name || recipe.menuItemId}
                  </td>

                  <td className="py-3">
                    {recipe.ingredients?.length || 0}
                  </td>

                  <td className="py-3">
                    {recipe.createdAt
                      ? new Date(recipe.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}

              {recipes.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-5 text-slate-500"
                  >
                    No recipes created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default RecipesPage;