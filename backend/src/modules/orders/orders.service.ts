import prisma from "../../lib/prisma";

import { getIO } from "../../socket";

const deductInventoryFromOrder = async (
  orderId: string
): Promise<void> => {
  // Placeholder until inventory deduction service is available
  return;
};

const generateOrderNumber = () => {
  return `ORD-${Date.now()}`;
};

const generateKitchenTicketNumber = () => {
  return `KOT-${Date.now()}`;
};

const safeCreatedBySelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  restaurantId: true,
  createdAt: true,
};

const createOrder = async (
  data: any
) => {

  const menuItemIds = data.items.map(
    (item: any) => item.menuItemId
  );

  const menuItems =
    await prisma.menuItem.findMany({
      where: {
        id: {
          in: menuItemIds,
        },

        restaurantId:
          data.restaurantId,
      },
    });

  const orderItems =
    data.items.map((item: any) => {

      const menuItem =
        menuItems.find(
          (m) =>
            m.id === item.menuItemId
        );

      if (!menuItem) {

        throw new Error(
          `Menu item not found: ${item.menuItemId}`
        );

      }

      const subtotal =
        menuItem.price
        * item.quantity;

      return {
        menuItemId: menuItem.id,

        quantity: item.quantity,

        price: menuItem.price,

        subtotal,
      };

    });

  const totalAmount =
    orderItems.reduce(
      (
        sum: number,
        item: any
      ) => sum + item.subtotal,
      0
    );

  const order =
    await prisma.order.create({

      data: {
        orderNumber:
          generateOrderNumber(),

        type:
          data.type
          || "DINE_IN",

        restaurantId:
          data.restaurantId,

        tableId:
          data.tableId,

        createdById:
          data.createdById,

        totalAmount,

        items: {
          create: orderItems,
        },
      },

      include: {
        items: {
          include: {
            menuItem: true,
          },
        },

        table: true,

        createdBy: {
          select:
            safeCreatedBySelect,
        },
      },

    });

  //
  // CREATE KITCHEN TICKET
  //

  await prisma.kitchenTicket.create({

    data: {
      ticketNumber:
        generateKitchenTicketNumber(),

      restaurantId:
        data.restaurantId,

      orderId:
        order.id,

      notes:
        data.notes || null,
    },

  });

  //
  // UPDATE TABLE STATUS
  //

  if (data.tableId) {

    await prisma.restaurantTable.update({

      where: {
        id: data.tableId,
      },

      data: {
        status: "OCCUPIED",
      },

    });

  }

  //
  // AUTO INVENTORY DEDUCTION
  //

  await deductInventoryFromOrder(
    order.id
  );

  //
  // SOCKET EVENTS
  //

  const io = getIO();

  io.emit(
    "new-order",
    order
  );

  return order;

};

const getOrders = async (
  restaurantId: string
) => {

  return prisma.order.findMany({

    where: {
      restaurantId,
    },

    include: {

      items: {
        include: {
          menuItem: true,
        },
      },

      table: true,

      createdBy: {
        select:
          safeCreatedBySelect,
      },

    },

    orderBy: {
      createdAt: "desc",
    },

  });

};

const updateOrderStatus = async (
  orderId: string,
  status: any
) => {

  const order =
    await prisma.order.update({

      where: {
        id: orderId,
      },

      data: {
        status,
      },

      include: {

        table: true,

        createdBy: {
          select:
            safeCreatedBySelect,
        },

        items: {
          include: {
            menuItem: true,
          },
        },

      },

    });

  //
  // FREE TABLE WHEN ORDER COMPLETES
  //

  if (
    order.tableId &&
    ["COMPLETED", "CANCELLED"]
      .includes(status)
  ) {

    await prisma.restaurantTable.update({

      where: {
        id: order.tableId,
      },

      data: {
        status: "AVAILABLE",
      },

    });

  }

  //
  // SOCKET EVENTS
  //

  const io = getIO();

  io.emit(
    "order-status-updated",
    order
  );

  return order;

};

export {
  createOrder,
  getOrders,
  updateOrderStatus,
};