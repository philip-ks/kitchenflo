import {
  Request,
  Response,
} from "express";

import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "./brands.service";

const getParamAsString = (
  value: string | string[] | undefined
) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const listBrands = async (
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

    const brands =
      await getBrands(restaurantId);

    return res.json({
      success: true,
      data: brands,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch brands",
    });
  }
};

const addBrand = async (
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
      description,
      active,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message:
          "Brand name is required",
      });
    }

    const brand =
      await createBrand(
        restaurantId,
        {
          name,
          description,
          active,
        }
      );

    return res.status(201).json({
      success: true,
      data: brand,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create brand",
    });
  }
};

const editBrand = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    const brandId =
      getParamAsString(req.params.id);

    if (!restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!brandId) {
      return res.status(400).json({
        success: false,
        message:
          "Brand ID is required",
      });
    }

    const brand =
      await updateBrand(
        restaurantId,
        brandId,
        {
          name: req.body.name,
          description:
            req.body.description,
          active: req.body.active,
        }
      );

    return res.json({
      success: true,
      data: brand,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update brand",
    });
  }
};

const removeBrand = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId =
      req.user?.restaurantId;

    const brandId =
      getParamAsString(req.params.id);

    if (!restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!brandId) {
      return res.status(400).json({
        success: false,
        message:
          "Brand ID is required",
      });
    }

    const result =
      await deleteBrand(
        restaurantId,
        brandId
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
        "Failed to delete brand",
    });
  }
};

export {
  listBrands,
  addBrand,
  editBrand,
  removeBrand,
};
