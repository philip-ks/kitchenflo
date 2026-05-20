import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Table,
  ClipboardList,
  ChefHat,
  Receipt,
  BarChart3,
  LogOut,
} from "lucide-react";

const cards = [
  {
    title: "Menu",
    description: "Manage categories and food items",
    icon: Utensils,
  },
  {
    title: "Tables",
    description: "View table occupancy and capacity",
    icon: Table,
  },
  {
    title: "Orders",
    description: "Create and manage POS orders",
    icon: ClipboardList,
  },
  {
    title: "Kitchen",
    description: "Track KOT and kitchen status",
    icon: ChefHat,
  },
  {
    title: "Billing",
    description: "Invoices, payments and receipts",
    icon: Receipt,
  },
  {
    title: "Reports",
    description: "Daily sales and payment analytics",
    icon: BarChart3,
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("kitchenflo_user") || "{}"
  );

  const logout = () => {
    localStorage.removeItem("kitchenflo_token");
    localStorage.removeItem("kitchenflo_user");
    localStorage.removeItem("kitchenflo_restaurant_id");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white p-2 rounded-xl">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              KitchenFlo Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Welcome, {user.name || "User"} · {user.role || "ROLE"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <main className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Restaurant Operations
          </h2>
          <p className="text-slate-500 mt-1">
            Backend modules are ready. Frontend screens will connect one by one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
              >
                <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="text-slate-900" size={24} />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {card.title}
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
