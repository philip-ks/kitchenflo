import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Table } from "lucide-react";
import { api } from "../../services/api";

type RestaurantTable = {
  id: string;
  name: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
  restaurantId: string;
};

export default function TablesPage() {
  const navigate = useNavigate();

  const restaurantId = localStorage.getItem("kitchenflo_restaurant_id");

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    if (!restaurantId) return;

    const response = await api.get(`/tables/${restaurantId}`);
    setTables(response.data.data);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const createTable = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!restaurantId || !name || !capacity) {
      setMessage("Please enter table name and capacity");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.post("/tables", {
        name,
        capacity: Number(capacity),
        restaurantId,
      });

      setName("");
      setCapacity("");
      setMessage("Table created successfully");
      await fetchTables();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Failed to create table");
    } finally {
      setLoading(false);
    }
  };

  const statusClass = (status: string) => {
    if (status === "AVAILABLE") {
      return "bg-green-100 text-green-700";
    }

    if (status === "OCCUPIED") {
      return "bg-red-100 text-red-700";
    }

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
              Table Management
            </h1>
            <p className="text-sm text-slate-500">
              Manage restaurant tables and occupancy
            </p>
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">
              Add Table
            </h2>

            <form onSubmit={createTable} className="space-y-4">
              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                placeholder="Example: T2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                placeholder="Capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />

              <button
                disabled={loading}
                className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Create Table
              </button>
            </form>

            {message && (
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">
                {message}
              </div>
            )}
          </div>
        </section>

        <section className="xl:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Tables
            </h2>
            <p className="text-sm text-slate-500">
              {tables.length} tables found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tables.map((table) => (
              <div
                key={table.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
              >
                <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Table size={22} />
                </div>

                <h3 className="font-bold text-slate-900 text-lg">
                  {table.name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Capacity: {table.capacity}
                </p>

                <div className="mt-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${statusClass(
                      table.status
                    )}`}
                  >
                    {table.status}
                  </span>
                </div>
              </div>
            ))}

            {tables.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-slate-500">
                No tables found. Create your first table.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
