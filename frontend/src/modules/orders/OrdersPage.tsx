import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { api } from "../../services/api";

type RestaurantTable = {
  id: string;
  name: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
};

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  category?: {
    id: string;
    name: string;
  };
};

type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

export default function OrdersPage() {
  const navigate = useNavigate();

  const restaurantId = localStorage.getItem("kitchenflo_restaurant_id");

  const user = JSON.parse(
    localStorage.getItem("kitchenflo_user") || "{}"
  );

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!restaurantId) return;

    const [tablesRes, menuRes] = await Promise.all([
      api.get(`/tables/${restaurantId}`),
      api.get(`/menu/items/${restaurantId}`),
    ]);

    setTables(tablesRes.data.data);
    setMenuItems(menuRes.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((current) => {
      const existing = current.find(
        (cartItem) => cartItem.menuItemId === item.id
      );

      if (existing) {
        return current.map((cartItem) =>
          cartItem.menuItemId === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...current,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  const decreaseQuantity = (menuItemId: string) => {
    setCart((current) =>
      current
        .map((item) =>
          item.menuItemId === menuItemId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  const createOrder = async () => {
    if (!restaurantId) {
      setMessage("Restaurant not found. Please login again.");
      return;
    }

    if (!selectedTableId) {
      setMessage("Please select a table");
      return;
    }

    if (cart.length === 0) {
      setMessage("Please add at least one item");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/orders", {
        type: "DINE_IN",
        restaurantId,
        tableId: selectedTableId,
        createdById: user.id,
        items: cart.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      });

      setMessage(
        `Order created successfully: ${response.data.data.orderNumber}`
      );

      setSelectedTableId("");
      setCart([]);

      await fetchData();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const statusClass = (status: string) => {
    if (status === "AVAILABLE") return "bg-green-100 text-green-700";
    if (status === "OCCUPIED") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              POS Orders
            </h1>
            <p className="text-sm text-slate-500">
              Select a table, add items, and create an order
            </p>
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Select Table
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  disabled={table.status !== "AVAILABLE"}
                  className={`bg-white border rounded-xl p-4 text-left hover:shadow-sm disabled:opacity-50 ${
                    selectedTableId === table.id
                      ? "border-slate-900 ring-2 ring-slate-900"
                      : "border-slate-200"
                  }`}
                >
                  <div className="font-bold text-slate-900">
                    {table.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    Capacity: {table.capacity}
                  </div>
                  <span
                    className={`inline-block mt-3 text-xs px-2 py-1 rounded-full font-semibold ${statusClass(
                      table.status
                    )}`}
                  >
                    {table.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Menu Items
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  disabled={!item.available}
                  className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:shadow-md transition disabled:opacity-50"
                >
                  <h3 className="font-bold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {item.description || "No description"}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-slate-900">
                      ₹{item.price}
                    </span>

                    <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                      {item.category?.name || "Item"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart size={20} />
              <h2 className="text-lg font-bold text-slate-900">
                Current Order
              </h2>
            </div>

            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center justify-between border-b border-slate-100 pb-3"
                >
                  <div>
                    <div className="font-semibold text-slate-900">
                      {item.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      ₹{item.price} × {item.quantity}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.menuItemId)}
                      className="bg-slate-100 p-1 rounded-md"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        addToCart({
                          id: item.menuItemId,
                          name: item.name,
                          price: item.price,
                          available: true,
                        })
                      }
                      className="bg-slate-100 p-1 rounded-md"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <p className="text-sm text-slate-500">
                  No items added yet.
                </p>
              )}
            </div>

            <div className="border-t border-slate-200 mt-5 pt-5">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>

              <button
                onClick={createOrder}
                disabled={loading}
                className="w-full mt-5 bg-slate-900 text-white rounded-lg px-4 py-3 font-semibold hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Order"}
              </button>
            </div>

            {message && (
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">
                {message}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
