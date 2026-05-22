import { useEffect, useState } from "react";
import {
  Package,
  AlertTriangle,
  Plus,
} from "lucide-react";

import { api } from "../../services/api";

type Ingredient = {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  costPerUnit: number;
};

export default function InventoryPage() {
  const [ingredients, setIngredients] =
    useState<Ingredient[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      unit: "",
      currentStock: "",
      minimumStock: "",
      costPerUnit: "",
    });

  const restaurantId =
    localStorage.getItem(
      "kitchenflo_restaurant_id"
    );

  const fetchIngredients =
    async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response =
          await api.get(
            `/inventory/ingredients/${restaurantId}`
          );

        const data =
          response.data.data ||
          response.data.ingredients ||
          response.data ||
          [];

        setIngredients(
          Array.isArray(data) ? data : []
        );
      } catch (error: any) {
        console.error(
          "Failed to fetch ingredients:",
          error
        );

        setErrorMessage(
          error?.response?.data?.message ||
            "Failed to load ingredients."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (restaurantId) {
      fetchIngredients();
    } else {
      setLoading(false);
      setErrorMessage(
        "Restaurant ID not found. Please login again."
      );
    }
  }, []);

  const createIngredient =
    async () => {
      try {
        setErrorMessage("");

        if (!restaurantId) {
          setErrorMessage(
            "Restaurant ID not found. Please login again."
          );
          return;
        }

        if (!formData.name.trim()) {
          setErrorMessage(
            "Ingredient name is required."
          );
          return;
        }

        if (!formData.unit.trim()) {
          setErrorMessage(
            "Unit is required."
          );
          return;
        }

        setSaving(true);

        await api.post(
          "/inventory/ingredients",
          {
            name: formData.name.trim(),
            unit: formData.unit.trim(),
            currentStock:
              Number(formData.currentStock) || 0,
            minimumStock:
              Number(formData.minimumStock) || 0,
            costPerUnit:
              Number(formData.costPerUnit) || 0,
            restaurantId,
          }
        );

        setFormData({
          name: "",
          unit: "",
          currentStock: "",
          minimumStock: "",
          costPerUnit: "",
        });

        setShowForm(false);

        await fetchIngredients();
      } catch (error: any) {
        console.error(
          "Failed to create ingredient:",
          error
        );

        setErrorMessage(
          error?.response?.data?.message ||
            "Failed to save ingredient. Please check backend logs."
        );
      } finally {
        setSaving(false);
      }
    };

  const lowStockItems =
    ingredients.filter(
      (item) =>
        Number(item.currentStock) <=
        Number(item.minimumStock)
    );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Inventory
          </h1>

          <p className="text-slate-500 mt-1">
            Manage ingredients, stock levels, and costing
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl"
        >
          <Plus size={18} />
          Add Ingredient
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle
              className="text-red-600"
              size={20}
            />

            <h2 className="font-bold text-red-700">
              Low Stock Alerts
            </h2>
          </div>

          <div className="space-y-2">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm"
              >
                <span>{item.name}</span>

                <span className="font-semibold text-red-600">
                  {item.currentStock} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">
            Add Ingredient
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ingredient Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="border border-slate-300 rounded-xl px-4 py-3"
            />

            <input
              type="text"
              placeholder="Unit (kg, ltr, pcs)"
              value={formData.unit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  unit: e.target.value,
                })
              }
              className="border border-slate-300 rounded-xl px-4 py-3"
            />

            <input
              type="number"
              placeholder="Current Stock"
              value={formData.currentStock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currentStock:
                    e.target.value,
                })
              }
              className="border border-slate-300 rounded-xl px-4 py-3"
            />

            <input
              type="number"
              placeholder="Minimum Stock"
              value={formData.minimumStock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimumStock:
                    e.target.value,
                })
              }
              className="border border-slate-300 rounded-xl px-4 py-3"
            />

            <input
              type="number"
              placeholder="Cost Per Unit"
              value={formData.costPerUnit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  costPerUnit:
                    e.target.value,
                })
              }
              className="border border-slate-300 rounded-xl px-4 py-3 md:col-span-2"
            />
          </div>

          <button
            onClick={createIngredient}
            disabled={saving}
            className="mt-4 bg-slate-900 text-white px-5 py-3 rounded-xl disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Ingredient"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-slate-500">
          Loading inventory...
        </div>
      ) : ingredients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package
            className="mx-auto text-slate-400 mb-4"
            size={48}
          />

          <h3 className="text-lg font-semibold text-slate-900">
            No Ingredients Found
          </h3>

          <p className="text-slate-500 mt-2">
            Start adding inventory items
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {ingredients.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-slate-100 p-3 rounded-xl">
                  <Package
                    className="text-slate-900"
                    size={22}
                  />
                </div>

                {Number(item.currentStock) <=
                  Number(item.minimumStock) && (
                  <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
                    Low Stock
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                {item.name}
              </h2>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Current Stock
                  </span>

                  <span className="font-semibold">
                    {item.currentStock} {item.unit}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Minimum Stock
                  </span>

                  <span className="font-semibold">
                    {item.minimumStock} {item.unit}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Cost / Unit
                  </span>

                  <span className="font-semibold">
                    ₹
                    {Number(
                      item.costPerUnit || 0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}