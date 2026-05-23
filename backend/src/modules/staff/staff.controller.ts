import {
  Request,
  Response,
} from "express";

import {
  getStaffList,
  createStaff,
  updateStaff,
  deleteStaff,
} from "./staff.service";

const allowedRoles = [
  "MANAGER",
  "CASHIER",
  "CHEF",
  "WAITER",
];

const getParamAsString = (
  value: string | string[] | undefined
) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const getStaff = async (
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

    const staff =
      await getStaffList(restaurantId);

    return res.json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch staff",
    });
  }
};

const addStaff = async (
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
      name,
      email,
      phone,
      role,
      pin,
    } = req.body;

    if (!name || !email || !role || !pin) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, role and PIN are required",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff role",
      });
    }

    const staff =
      await createStaff(restaurantId, {
        name,
        email,
        phone,
        role,
        pin,
      });

    return res.status(201).json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create staff",
    });
  }
};

const editStaff = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    const staffId =
      getParamAsString(req.params.id);

    if (!restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    if (
      req.body.role &&
      !allowedRoles.includes(req.body.role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff role",
      });
    }

    const staff =
      await updateStaff(
        restaurantId,
        staffId,
        {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          role: req.body.role,
          pin: req.body.pin,
        }
      );

    return res.json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update staff",
    });
  }
};

const removeStaff = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    const staffId =
      getParamAsString(req.params.id);

    if (!restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    const result =
      await deleteStaff(
        restaurantId,
        staffId
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
        "Failed to delete staff",
    });
  }
};

export {
  getStaff,
  addStaff,
  editStaff,
  removeStaff,
};
