import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Package,
  ShoppingCart,
} from "lucide-react";

import {
  getProfitabilityAnalytics,
  getConsumptionAnalytics,
  getLowStockAnalytics,
  getProcurementAnalytics,
} from "./analytics.service";

const AnalyticsPage = () => {
  const [profitability, setProfitability] = useState<any[]>([]);
  const [consumption, setConsumption] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [procurement, setProcurement] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const [
        profitabilityData,
        consumptionData,
        lowStockData,
        procurementData,
      ] = await Promise.all([
        getProfitabilityAnalytics(),
        getConsumptionAnalytics(),
        getLowStockAnalytics(),
        getProcurementAnalytics(),
      ]);

      setProfitability(profitabilityData || []);
      setConsumption(consumptionData || []);
      setLowStock(lowStockData || []);
      setProcurement(procurementData || []);
    } catch (error) {
      console.error("Failed to load analytics", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  const totalProfit = profitability.reduce(
    (sum, item) => sum + Number(item.profit || 0),
    0
  );

  const avgFoodCost =
    profitability.length > 0
      ? profitability.reduce(
          (sum, item) => sum + Number(item.foodCostPercentage || 0),
          0
        ) / profitability.length
      : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Food cost, inventory usage, low stock, and procurement intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            <div>
              <p className="text-sm text-gray-500">Total Profit</p>
              <p className="text-xl font-bold">₹{totalProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6" />
            <div>
              <p className="text-sm text-gray-500">Avg Food Cost</p>
              <p className="text-xl font-bold">{avgFoodCost.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-xl font-bold">{lowStock.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6" />
            <div>
              <p className="text-sm text-gray-500">Procurement Items</p>
              <p className="text-xl font-bold">{procurement.length}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Menu Profitability</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2">Item</th>
                <th className="py-2">Selling Price</th>
                <th className="py-2">Recipe Cost</th>
                <th className="py-2">Profit</th>
                <th className="py-2">Food Cost %</th>
              </tr>
            </thead>
            <tbody>
              {profitability.map((item) => (
                <tr key={item.menuItemId} className="border-b">
                  <td className="py-2 font-medium">{item.menuItemName}</td>
                  <td className="py-2">₹{Number(item.sellingPrice).toFixed(2)}</td>
                  <td className="py-2">₹{Number(item.recipeCost).toFixed(2)}</td>
                  <td className="py-2">₹{Number(item.profit).toFixed(2)}</td>
                  <td className="py-2">
                    {Number(item.foodCostPercentage).toFixed(2)}%
                  </td>
                </tr>
              ))}

              {profitability.length === 0 && (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={5}>
                    No profitability data yet. Add recipes for menu items.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Daily Consumption</h2>

          <div className="space-y-3">
            {consumption.map((item) => (
              <div
                key={item.ingredientId}
                className="flex items-center justify-between border-b pb-2"
              >
                <span className="font-medium">{item.ingredientName}</span>
                <span>{Number(item.totalConsumed).toFixed(2)}</span>
              </div>
            ))}

            {consumption.length === 0 && (
              <p className="text-sm text-gray-500">
                No consumption data for today.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Low Stock</h2>

          <div className="space-y-3">
            {lowStock.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-3"
              >
                <div>
                  <p className="font-medium text-red-700">{item.name}</p>
                  <p className="text-xs text-red-500">
                    Minimum: {item.minimumStock}
                  </p>
                </div>
                <span className="font-semibold text-red-700">
                  {item.currentStock}
                </span>
              </div>
            ))}

            {lowStock.length === 0 && (
              <p className="text-sm text-gray-500">
                No low stock items.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          Procurement Recommendations
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2">Ingredient</th>
                <th className="py-2">Current Stock</th>
                <th className="py-2">Avg Daily Use</th>
                <th className="py-2">Days Remaining</th>
                <th className="py-2">Recommended Purchase</th>
              </tr>
            </thead>
            <tbody>
              {procurement.map((item) => (
                <tr key={item.ingredientId} className="border-b">
                  <td className="py-2 font-medium">{item.ingredientName}</td>
                  <td className="py-2">
                    {Number(item.currentStock).toFixed(2)}
                  </td>
                  <td className="py-2">
                    {Number(item.averageDailyConsumption).toFixed(2)}
                  </td>
                  <td className="py-2">
                    {Number(item.daysRemaining).toFixed(2)}
                  </td>
                  <td className="py-2">
                    {Number(item.recommendedPurchaseQuantity).toFixed(2)}
                  </td>
                </tr>
              ))}

              {procurement.length === 0 && (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={5}>
                    No procurement recommendations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;