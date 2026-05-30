import {
  Request,
  Response,
} from "express";

import {
  expenseCategories,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./expenses.service";

const getParamAsString = (
  value: string | string[] | undefined
) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const listExpenseCategories = async (
  _req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    data: expenseCategories,
  });
};

const listExpenses = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const expenses =
      await getExpenses(restaurantId);

    return res.json({
      success: true,
      data: expenses,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch expenses",
    });
  }
};

const addExpense = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      category,
      amount,
      date,
      recurring,
      notes,
      linkedOrderId,
    } = req.body;

    if (
      !category ||
      amount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Category and amount are required",
      });
    }

    const expense =
      await createExpense(
        restaurantId,
        {
          category,
          amount,
          date,
          recurring,
          notes,
          linkedOrderId,
        }
      );

    return res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create expense",
    });
  }
};

const editExpense = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    const expenseId =
      getParamAsString(req.params.id);

    if (!restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!expenseId) {
      return res.status(400).json({
        success: false,
        message:
          "Expense ID is required",
      });
    }

    const expense =
      await updateExpense(
        restaurantId,
        expenseId,
        {
          category: req.body.category,
          amount: req.body.amount,
          date: req.body.date,
          recurring:
            req.body.recurring,
          notes: req.body.notes,
          linkedOrderId:
            req.body.linkedOrderId,
        }
      );

    return res.json({
      success: true,
      data: expense,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update expense",
    });
  }
};

const removeExpense = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    const expenseId =
      getParamAsString(req.params.id);

    if (!restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!expenseId) {
      return res.status(400).json({
        success: false,
        message:
          "Expense ID is required",
      });
    }

    const result =
      await deleteExpense(
        restaurantId,
        expenseId
      );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to delete expense",
    });
  }
};

export {
  listExpenseCategories,
  listExpenses,
  addExpense,
  editExpense,
  removeExpense,
};
