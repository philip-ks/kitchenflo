import { Request, Response } from "express";

import { getDailySalesReport } from "./reports.service";

export const getDailySalesReportController = async (
  req: Request,
  res: Response
) => {
  try {
    const report = await getDailySalesReport(
      req.params.restaurantId
    );

    return res.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
