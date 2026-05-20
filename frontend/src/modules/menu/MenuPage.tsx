import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Utensils } from "lucide-react";
import { api } from "../../services/api";

type Category = {
  id: string;
  name: string;
};

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  category?: Category;
};

export default function MenuPage() {
  const navigate = useNavigate();

  const restaurantId = localStorage.getItem("kitchenflo_restaurant_id");

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);

  const [categoryName, setCategoryName] = useState("");

  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchMenuData = async () => {
    if (!restaurantId) return;

    const [categoryRes, itemRes] = await Promise.all([
      api.get(`/menu/categories/${restaurantId}`),
      api.get(`/menu/items/${restaurantId}`),
    ]);

    setCategories(categoryRes.data.data);
    setItems(itemRes.data.data);
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const createCategory = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!restaurantId || !categoryName.trim()) return;

    try {
      setLoading(true);
      setMessage("");

      await api.post("/menu/categories", {
        name: categoryName,
        restaurantId,
      });

      setCategoryName("");
      setMessage("Category created successfully");
      await fetchMenuData();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const createMenuItem = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!restaurantId || !itemName || !itemPrice || !categoryId) {
      setMessage("Please fill all required item fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.post("/menu/items", {
        name: itemName,
        description: itemDescription,
        price: Number(itemPrice),
        available: true,
        restaurantId,
        categoryId,
      });

      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setCategoryId("");

      setMessage("Menu item created successfully");
      await fetchMenuData();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Failed to create item");
    } finally {
      setLoading(false);
    }
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
              Menu Management
            </h1>
            <p className="text-sm text-slate-500">
              Create categories and menu items for your restaurant
            </p>
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">
              Add Category
            </h2>

            <form onSubmit={createCategory} className="space-y-4">
              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                placeholder="Example: Beverages"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />

              <button
                disabled={loading}
                className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Create Category
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">
              Add Menu Item
            </h2>

            <form onSubmit={createMenuItem} className="space-y-4">
              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                placeholder="Item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />

              <textarea
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                placeholder="Description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />

              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                placeholder="Price"
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />

              <select
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button
                disabled={loading}
                className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Create Menu Item
              </button>
            </form>
          </div>

          {message && (
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          )}
        </section>

        <section className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Menu Items
              </h2>
              <p className="text-sm text-slate-500">
                {items.length} items found
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
              >
                <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Utensils size={22} />
                </div>

                <h3 className="font-bold text-slate-900 text-lg">
                  {item.name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {item.description || "No description"}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-slate-900">
                    ₹{item.price}
                  </span>

                  <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                    {item.category?.name || "Uncategorized"}
                  </span>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-slate-500">
                No menu items found. Create your first item.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
