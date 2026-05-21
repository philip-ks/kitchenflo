import { useEffect, useState } from "react";

import {
  ShoppingBag,
  Plus,
} from "lucide-react";

import { api } from "../../services/api";

type Ingredient = {
  id: string;
  name: string;
  unit: string;
};

type Supplier = {
  id: string;
  name: string;
};

export default function PurchaseEntryPage() {
  const [ingredients, setIngredients] =
    useState<Ingredient[]>([]);

  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [success, setSuccess] =
    useState("");

  const [formData, setFormData] =
    useState({
      ingredientId: "",
      supplierId: "",
      quantity: 0,
      price: 0,
    });

  const restaurantId =
    localStorage.getItem(
      "kitchenflo_restaurant_id"
    );

  const fetchData = async () => {
    try {
      const [
        ingredientsResponse,
        suppliersResponse,
      ] = await Promise.all([
        api.get(
          `/inventory/ingredients/${restaurantId}`
        ),

        api.get(
          `/inventory/suppliers/${restaurantId}`
        ),
      ]);

      setIngredients(
        ingredientsResponse.data.data || []
      );

      setSuppliers(
        suppliersResponse.data.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createPurchaseEntry =
    async () => {
      try {
        await api.post(
          "/inventory/stock-entry",
          {
            ...formData,
            restaurantId,
          }
        );

        setSuccess(
          "Purchase entry created successfully"
        );

        setFormData({
          ingredientId: "",
          supplierId: "",
          quantity: 0,
          price: 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading purchase system...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-900 text-white p-3 rounded-2xl">
          <ShoppingBag size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Purchase Entry
          </h1>

          <p className="text-slate-500">
            Record procurement and stock inward
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Ingredient
            </label>

            <select
              value={formData.ingredientId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ingredientId:
                    e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
            >
              <option value="">
                Select Ingredient
              </option>

              {ingredients.map(
                (ingredient) => (
                  <option
                    key={ingredient.id}
                    value={ingredient.id}
                  >
                    {ingredient.name} (
                    {ingredient.unit})
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Supplier
            </label>

            <select
              value={formData.supplierId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  supplierId:
                    e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
            >
              <option value="">
                Select Supplier
              </option>

              {suppliers.map(
                (supplier) => (
                  <option
                    key={supplier.id}
                    value={supplier.id}
                  >
                    {supplier.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Quantity
            </label>

            <input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              placeholder="Enter Quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Purchase Price
            </label>

            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number(
                    e.target.value
                  ),
                })
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              placeholder="Enter Price"
            />
          </div>
        </div>

        <button
          onClick={createPurchaseEntry}
          className="mt-6 flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800"
        >
          <Plus size={18} />
          Save Purchase Entry
        </button>

        {success && (
          <div className="mt-5 bg-green-100 text-green-700 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}