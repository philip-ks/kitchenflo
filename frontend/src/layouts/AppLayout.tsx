import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  ClipboardList,
  Receipt,
  BarChart3,
  Table,
  Utensils,
  LogOut,
  Package,
  Truck,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },

  {
    label: "POS",
    icon: ShoppingCart,
    path: "/dashboard/pos",
  },

  {
    label: "Kitchen",
    icon: ChefHat,
    path: "/dashboard/kitchen",
  },

  {
    label: "Orders",
    icon: ClipboardList,
    path: "/dashboard/orders",
  },

  {
    label: "Billing",
    icon: Receipt,
    path: "/dashboard/billing",
  },

  {
    label: "Reports",
    icon: BarChart3,
    path: "/dashboard/reports",
  },

  {
    label: "Tables",
    icon: Table,
    path: "/dashboard/tables",
  },

  {
    label: "Menu",
    icon: Utensils,
    path: "/dashboard/menu",
  },

  {
    label: "Inventory",
    icon: Package,
    path: "/dashboard/inventory",
  },

  {
    label: "Suppliers",
    icon: Truck,
    path: "/dashboard/suppliers",
  },
];

export default function AppLayout() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem(
      "kitchenflo_user"
    ) || "{}"
  );

  const logout = () => {
    localStorage.removeItem(
      "kitchenflo_token"
    );

    localStorage.removeItem(
      "kitchenflo_user"
    );

    localStorage.removeItem(
      "kitchenflo_restaurant_id"
    );

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-72 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold">
            KitchenFlo
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Restaurant OS
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-white text-slate-900"
                      : "hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={20} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4">
            <p className="font-semibold">
              {user.name}
            </p>

            <p className="text-sm text-slate-400">
              {user.role}
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-xl"
          >
            <LogOut size={18} />

            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}