import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import LoginPage from "./modules/auth/LoginPage";
import GitHubCallbackPage from "./modules/auth/GitHubCallbackPage";

import DashboardPage from "./modules/dashboard/DashboardPage";
import MenuPage from "./modules/menu/MenuPage";
import TablesPage from "./modules/tables/TablesPage";
import OrdersPage from "./modules/orders/OrdersPage";
import KitchenPage from "./modules/kitchen/KitchenPage";
import BillingPage from "./modules/billing/BillingPage";
import ReportsPage from "./modules/reports/ReportsPage";
import PosPage from "./modules/pos/PosPage";
import InventoryPage from "./modules/inventory/InventoryPage";
import SuppliersPage from "./modules/suppliers/SuppliersPage";
import PurchaseEntryPage from "./modules/purchases/PurchaseEntryPage";
import AnalyticsPage from "./modules/analytics/AnalyticsPage";
import RecipesPage from "./modules/recipes/RecipesPage";
import ProfilePage from "./modules/profile/ProfilePage";
import StaffPage from "./modules/staff/StaffPage";

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
          path="/auth/github/callback"
          element={<GitHubCallbackPage />}
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
            element={<DashboardPage />}
          />

          <Route
            path="/dashboard/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/dashboard/staff"
            element={<StaffPage />}
          />

          <Route
            path="/dashboard/pos"
            element={<PosPage />}
          />

          <Route
            path="/dashboard/menu"
            element={<MenuPage />}
          />

          <Route
            path="/dashboard/tables"
            element={<TablesPage />}
          />

          <Route
            path="/dashboard/orders"
            element={<OrdersPage />}
          />

          <Route
            path="/dashboard/kitchen"
            element={<KitchenPage />}
          />

          <Route
            path="/dashboard/billing"
            element={<BillingPage />}
          />

          <Route
            path="/dashboard/reports"
            element={<ReportsPage />}
          />

          <Route
            path="/dashboard/analytics"
            element={<AnalyticsPage />}
          />

          <Route
            path="/dashboard/recipes"
            element={<RecipesPage />}
          />

          <Route
            path="/dashboard/inventory"
            element={<InventoryPage />}
          />

          <Route
            path="/dashboard/suppliers"
            element={<SuppliersPage />}
          />

          <Route
            path="/dashboard/purchases"
            element={<PurchaseEntryPage />}
          />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
