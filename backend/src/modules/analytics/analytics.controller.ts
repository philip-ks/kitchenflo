import { Request, Response } from "express";

import {
  getMenuProfitability,
} from "./analytics.service";

import {
  getDailyConsumptionAnalytics,
} from "./consumptionAnalytics.service";

import {
  getLowStockIngredients,
} from "./lowStockAnalytics.service";

import {
  getProcurementRecommendations,
} from "./procurementAnalytics.service";

//
// PROFITABILITY ANALYTICS
//

export const getProfitabilityAnalytics =
async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message:
          "Restaurant ID is required.",
      });
    }

    const data =
      await getMenuProfitability(
        restaurantId
      );

    return res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// CONSUMPTION ANALYTICS
//

export const getConsumptionAnalytics =
async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message:
          "Restaurant ID is required.",
      });
    }

    const data =
      await getDailyConsumptionAnalytics(
        restaurantId
      );

    return res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// LOW STOCK ANALYTICS
//

export const getLowStockAnalytics =
async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message:
          "Restaurant ID is required.",
      });
    }

    const data =
      await getLowStockIngredients(
        restaurantId
      );

    return res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// PROCUREMENT ANALYTICS
//

export const getProcurementAnalytics =
async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message:
          "Restaurant ID is required.",
      });
    }

    const data =
      await getProcurementRecommendations(
        restaurantId
      );

    return res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};