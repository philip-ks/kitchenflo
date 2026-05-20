import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { api } from "../../services/api";

type MenuCategory = {
  id: string;
  name: string;
};

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
};

type RestaurantTable = {
  id: string;
  name: string;
  status: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function PosPage() {
  const navigate = useNavigate();

  const [categories, setCategories] =
    useState<MenuCategory[]>([]);

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>([]);

  const [tables, setTables] =
    useState<RestaurantTable[]>([]);

  const [cart, setCart] = useState<
    CartItem[]
  >([]);

  const [selectedTable, setSelectedTable] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const restaurantId =
    localStorage.getItem(
      "kitchenflo_restaurant_id"
    );

  const user = JSON.parse(
    localStorage.getItem(
      "kitchenflo_user"
    ) || "{}"
  );

  const fetchData = async () => {
    try {
      const [
        categoriesResponse,
        menuResponse,
        tablesResponse,
      ] = await Promise.all([
        api.get(
          `/menu/categories/${restaurantId}`
        ),

        api.get(
          `/menu/items/${restaurantId}`
        ),

        api.get(
          `/tables/${restaurantId}`
        ),
      ]);

      setCategories(
        categoriesResponse.data.data
      );

      setMenuItems(
        menuResponse.data.data
      );

      setTables(
        tablesResponse.data.data
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

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) => p.id === item.id
      );

      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                quantity:
                  p.quantity + 1,
              }
            : p
        );
      }

      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (
    id: string
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (
    id: string
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  const removeItem = (
    id: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity,
      0
    );
  }, [cart]);

  const tax = subtotal * 0.05;

  const total = subtotal + tax;

  const createOrder = async () => {
    try {
      const payload = {
        restaurantId,
        tableId: selectedTable,
        createdById: user.id,
        type: "DINE_IN",

        items: cart.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      };

      await api.post(
        "/orders",
        payload
      );

      alert(
        "✅ Order created successfully"
      );

      setCart([]);

      fetchData();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create order"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading POS...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="bg-slate-100 p-2 rounded-xl"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="bg-slate-900 text-white p-2 rounded-xl">
            <ShoppingCart size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              POS Billing
            </h1>

            <p className="text-sm text-slate-500">
              Restaurant billing
              terminal
            </p>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">
                Menu Items
              </h2>

              <div className="text-sm text-slate-500">
                {
                  menuItems.length
                }{" "}
                items
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-2xl p-4 hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {
                      item.description
                    }
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="font-bold text-lg">
                      ₹
                      {item.price}
                    </div>

                    <button
                      onClick={() =>
                        addToCart(
                          item
                        )
                      }
                      className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-6">
            <h2 className="text-lg font-bold mb-6">
              Current Cart
            </h2>

            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700">
                Select Table
              </label>

              <select
                value={
                  selectedTable
                }
                onChange={(e) =>
                  setSelectedTable(
                    e.target.value
                  )
                }
                className="w-full mt-2 border border-slate-300 rounded-xl px-3 py-3"
              >
                <option value="">
                  Choose Table
                </option>

                {tables.map((table) => (
                  <option
                    key={table.id}
                    value={
                      table.id
                    }
                  >
                    {table.name} (
                    {
                      table.status
                    }
                    )
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-xl p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        {item.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        ₹
                        {
                          item.price
                        }
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                      className="text-red-500"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                      className="bg-slate-100 p-2 rounded-lg"
                    >
                      <Minus
                        size={16}
                      />
                    </button>

                    <div className="font-semibold">
                      {
                        item.quantity
                      }
                    </div>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                      className="bg-slate-100 p-2 rounded-lg"
                    >
                      <Plus
                        size={16}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 mt-6 pt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {subtotal.toFixed(
                    2
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>
                  Tax (5%)
                </span>

                <span>
                  ₹
                  {tax.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>

                <span>
                  ₹
                  {total.toFixed(2)}
                </span>
              </div>

              <button
                disabled={
                  cart.length ===
                    0 ||
                  !selectedTable
                }
                onClick={
                  createOrder
                }
                className="w-full bg-slate-900 text-white py-3 rounded-xl mt-4 disabled:opacity-50"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}