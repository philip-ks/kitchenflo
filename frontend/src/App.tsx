import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import LoginPage from "./modules/auth/LoginPage";

import DashboardPage from "./modules/dashboard/DashboardPage";

import MenuPage from "./modules/menu/MenuPage";

import TablesPage from "./modules/tables/TablesPage";

import OrdersPage from "./modules/orders/OrdersPage";

import KitchenPage from "./modules/kitchen/KitchenPage";

import BillingPage from "./modules/billing/BillingPage";

import ReportsPage from "./modules/reports/ReportsPage";

import PosPage from "./modules/pos/PosPage";

import InventoryPage from "./modules/inventory/InventoryPage";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem(
    "kitchenflo_token"
  );

  if (!token) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={
              <DashboardPage />
            }
          />

          <Route
            path="/dashboard/pos"
            element={<PosPage />}
          />

          <Route
            path="/dashboard/menu"
            element={
              <MenuPage />
            }
          />

          <Route
            path="/dashboard/tables"
            element={
              <TablesPage />
            }
          />

          <Route
            path="/dashboard/orders"
            element={
              <OrdersPage />
            }
          />

          <Route
            path="/dashboard/kitchen"
            element={
              <KitchenPage />
            }
          />

          <Route
            path="/dashboard/billing"
            element={
              <BillingPage />
            }
          />

          <Route
            path="/dashboard/reports"
            element={
              <ReportsPage />
            }
          />

          <Route
            path="/dashboard/inventory"
            element={
              <InventoryPage />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}