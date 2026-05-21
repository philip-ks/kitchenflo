import { api } from "../../services/api";

export const getProfitabilityAnalytics = async () => {
  const response = await api.get("/analytics/profitability");
  return response.data.data;
};

export const getConsumptionAnalytics = async () => {
  const response = await api.get("/analytics/consumption");
  return response.data.data;
};

export const getLowStockAnalytics = async () => {
  const response = await api.get("/analytics/low-stock");
  return response.data.data;
};

export const getProcurementAnalytics = async () => {
  const response = await api.get("/analytics/procurement");
  return response.data.data;
};