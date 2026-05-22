import { Request, Response } from "express";

import {
  getMyProfile,
  updateMyProfile,
  updateRestaurantProfile,
} from "./profile.service";

const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const restaurantId =
      req.user?.restaurantId;

    if (!userId || !restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await getMyProfile(
      userId,
      restaurantId
    );

    return res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch profile",
    });
  }
};

const updateProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const restaurantId =
      req.user?.restaurantId;

    if (!userId || !restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await updateMyProfile(
      userId,
      restaurantId,
      {
        name: req.body.name,
        phone: req.body.phone,
      }
    );

    return res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update profile",
    });
  }
};

const updateRestaurant = async (
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

    const restaurant =
      await updateRestaurantProfile(
        restaurantId,
        {
          name: req.body.name,
          phone: req.body.phone,
        }
      );

    return res.json({
      success: true,
      data: restaurant,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update restaurant profile",
    });
  }
};

export {
  getProfile,
  updateProfile,
  updateRestaurant,
};