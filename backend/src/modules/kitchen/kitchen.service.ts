import prisma from "../../lib/prisma";

const generateTicketNumber = () => {
  return `KOT-${Date.now()}`;
};

const createKitchenTicket = async (data: any) => {
  const existingTicket = await prisma.kitchenTicket.findUnique({
    where: {
      orderId: data.orderId,
    },
  });

  if (existingTicket) {
    throw new Error("Kitchen ticket already exists for this order");
  }

  return prisma.kitchenTicket.create({
    data: {
      ticketNumber: generateTicketNumber(),
      restaurantId: data.restaurantId,
      orderId: data.orderId,
      notes: data.notes,
    },
    include: {
      order: {
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
          table: true,
        },
      },
    },
  });
};

const getKitchenTickets = async (restaurantId: string) => {
  return prisma.kitchenTicket.findMany({
    where: {
      restaurantId,
    },
    include: {
      order: {
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
          table: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateKitchenTicketStatus = async (
  ticketId: string,
  status: any
) => {
  return prisma.kitchenTicket.update({
    where: {
      id: ticketId,
    },
    data: {
      status,
    },
    include: {
      order: {
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
          table: true,
        },
      },
    },
  });
};

export {
  createKitchenTicket,
  getKitchenTickets,
  updateKitchenTicketStatus,
};