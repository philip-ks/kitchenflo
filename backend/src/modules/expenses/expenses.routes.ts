import { Router } from "express";

import {
  listExpenseCategories,
  listExpenses,
  addExpense,
  editExpense,
  removeExpense,
} from "./expenses.controller";

import {
  requireAuth,
} from "../../middleware/auth";

const router = Router();

router.get(
  "/categories",
  requireAuth,
  listExpenseCategories
);

router.get(
  "/",
  requireAuth,
  listExpenses
);

router.post(
  "/",
  requireAuth,
  addExpense
);

router.put(
  "/:id",
  requireAuth,
  editExpense
);

router.delete(
  "/:id",
  requireAuth,
  removeExpense
);

export default router;
