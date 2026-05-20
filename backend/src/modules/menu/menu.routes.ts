import { Router } from "express";

import { requireAuth } from "../../middleware/auth";

import { requireRole } from "../../middleware/role";

import {
  createCategoryController,
  getCategoriesController,
  createMenuItemController,
  getMenuItemsController,
} from "./menu.controller";

const router = Router();

// Create category
router.post(
  "/categories",

  requireAuth,

  requireRole([
    "OWNER",
    "MANAGER",
  ]),

  createCategoryController
);

// Get categories
router.get(
  "/categories/:restaurantId",

  requireAuth,

  getCategoriesController
);

// Create menu item
router.post(
  "/items",

  requireAuth,

  requireRole([
    "OWNER",
    "MANAGER",
  ]),

  createMenuItemController
);

// Get menu items
router.get(
  "/items/:restaurantId",

  requireAuth,

  getMenuItemsController
);

export default router;