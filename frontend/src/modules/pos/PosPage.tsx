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

type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";

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

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [orderType, setOrderType] =
    useState<OrderType>("TAKEAWAY");

  const [selectedTable, setSelectedTable] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const restaurantId =
    localStorage.getItem("kitchenflo_restaurant_id");

  const user = JSON.parse(
    localStorage.getItem("kitchenflo_user") || "{}"
  );

  const fetchData = async () => {
    try {
      setLoading(true);

      const [menuResponse, tablesResponse] =
        await Promise.all([
          api.get(`/menu/items/${restaurantId}`),
          api.get(`/tables/${restaurantId}`),
        ]);

      setMenuItems(menuResponse.data.data || []);
      setTables(tablesResponse.data.data || []);
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
    setSuccessMessage("");

    setCart((prev) => {
      const existing = prev.find(
        (p) => p.id === item.id
      );

      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                quantity: p.quantity + 1,
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

  const increaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  const tax = subtotal * 0.05;

  const total = subtotal + tax;

  const createOrder = async () => {
    try {
      setSuccessMessage("");

      if (!restaurantId) {
        alert("Restaurant ID missing. Please login again.");
        return;
      }

      if (!user?.id) {
        alert("User ID missing. Please login again.");
        return;
      }

      if (cart.length === 0) {
        alert("Please add items to cart");
        return;
      }

      if (orderType === "DINE_IN" && !selectedTable) {
        alert("Please select a table for dine-in order");
        return;
      }

      setCreating(true);

      const payload = {
        restaurantId,
        tableId:
          orderType === "DINE_IN"
            ? selectedTable
            : null,
        createdById: user.id,
        type: orderType,

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
      setOrderType("TAKEAWAY");

      await fetchData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to create order"
      );
    } finally {
      setCreating(false);
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
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-lg bg-white border"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            POS Terminal
          </h1>

          <p className="text-slate-500">
            Create and manage QSR, takeaway, delivery, and dine-in orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              Order Type
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["TAKEAWAY", "DINE_IN", "DELIVERY"] as OrderType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setOrderType(type);

                      if (type !== "DINE_IN") {
                        setSelectedTable("");
                      }
                    }}
                    className={`p-4 rounded-2xl border text-left ${
                      orderType === type
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "bg-white"
                    }`}
                  >
                    <h3 className="font-bold">
                      {type === "TAKEAWAY"
                        ? "Takeaway"
                        : type === "DINE_IN"
                        ? "Dine In"
                        : "Delivery"}
                    </h3>

                    <p className="text-sm mt-1 opacity-80">
                      {type === "TAKEAWAY"
                        ? "Counter / QSR order"
                        : type === "DINE_IN"
                        ? "Table service order"
                        : "Delivery order"}
                    </p>
                  </button>
                )
              )}
            </div>
          </div>

          {orderType === "DINE_IN" && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">
                Select Table
              </h2>

              {tables.length === 0 ? (
                <div className="rounded-2xl border bg-white p-5 text-slate-500">
                  No tables found. Add tables from the Tables module, or use
                  Takeaway/Delivery for QSR orders.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tables.map((table) => {
                    const isOccupied =
                      table.status === "OCCUPIED";

                    return (
                      <button
                        key={table.id}
                        disabled={isOccupied}
                        onClick={() =>
                          setSelectedTable(table.id)
                        }
                        className={`p-4 rounded-2xl border text-left transition ${
                          selectedTable === table.id
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "bg-white"
                        } ${
                          isOccupied
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-slate-900"
                        }`}
                      >
                        <h3 className="font-bold">
                          {table.name}
                        </h3>

                        <p className="text-sm mt-1">
                          {table.status}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold mb-4">
              Menu Items
            </h2>

            {menuItems.length === 0 ? (
              <div className="rounded-2xl border bg-white p-8 text-slate-500">
                No menu items found. Add menu items first.
              </div>
            ) : (
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
                        onClick={() => addToCart(item)}
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
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border p-6 h-fit sticky top-6">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart size={24} />

            <div>
              <h2 className="text-2xl font-bold">
                Cart
              </h2>

              <p className="text-sm text-slate-500">
                {orderType === "TAKEAWAY"
                  ? "Takeaway"
                  : orderType === "DINE_IN"
                  ? "Dine In"
                  : "Delivery"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {cart.length === 0 && (
              <p className="text-sm text-slate-500">
                No items in cart.
              </p>
            )}

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
                    onClick={() => removeItem(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="p-1 border rounded"
                  >
                    <Minus size={16} />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
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

              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (5%)</span>

              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-xl font-bold pt-3 border-t">
              <span>Total</span>

              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={createOrder}
            disabled={creating}
            className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create Order"}
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