import { getIO } from "../../socket";

export const emitLowStockAlert = (
  ingredient: any
) => {

  const io = getIO();

  io.to("inventory").emit(
    "low-stock-alert",
    {
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      currentStock: ingredient.currentStock,
      minimumStock: ingredient.minimumStock,
    }
  );

};