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

  const [successMessage, setSuccessMessage] =
    useState("");

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
        menuResponse,
        tablesResponse,
      ] = await Promise.all([
        api.get(
          `/menu/items/${restaurantId}`
        ),

        api.get(
          `/tables/${restaurantId}`
        ),
      ]);

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
      if (!selectedTable) {
        alert("Please select a table");
        return;
      }

      if (cart.length === 0) {
        alert(
          "Please add items to cart"
        );
        return;
      }

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

      const response = await api.post(
        "/orders",
        payload
      );

      setSuccessMessage(
        `Order created successfully: ${response.data.data.orderNumber}`
      );

      setCart([]);

      setSelectedTable("");

      fetchData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to create order"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading POS...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="p-2 rounded-lg bg-white border"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            POS Terminal
          </h1>

          <p className="text-slate-500">
            Create and manage orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              Select Table
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tables.map((table) => (
                <button
                  key={table.id}
                  onClick={() =>
                    setSelectedTable(
                      table.id
                    )
                  }
                  className={`p-4 rounded-2xl border text-left ${
                    selectedTable ===
                    table.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "bg-white"
                  }`}
                >
                  <h3 className="font-bold">
                    {table.name}
                  </h3>

                  <p className="text-sm mt-1">
                    {table.status}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">
              Menu Items
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">
                        {item.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {item.description}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        addToCart(item)
                      }
                      className="bg-slate-900 text-white p-2 rounded-lg"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="mt-4 text-xl font-bold">
                    ₹{item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border p-6 h-fit sticky top-6">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart size={24} />

            <h2 className="text-2xl font-bold">
              Cart
            </h2>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border-b pb-4"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      ₹{item.price}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      decreaseQuantity(
                        item.id
                      )
                    }
                    className="p-1 border rounded"
                  >
                    <Minus size={16} />
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(
                        item.id
                      )
                    }
                    className="p-1 border rounded"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax (5%)</span>

              <span>
                ₹{tax.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-xl font-bold pt-3 border-t">
              <span>Total</span>

              <span>
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={createOrder}
            className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-semibold hover:bg-slate-800"
          >
            Create Order
          </button>

          {successMessage && (
            <div className="mt-4 p-4 rounded-xl bg-green-100 text-green-700 text-sm">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}