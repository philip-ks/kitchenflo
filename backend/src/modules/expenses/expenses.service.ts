import prisma from "../../lib/prisma";

const expenseCategories = [
  "RAW_MATERIALS",
  "PACKAGING",
  "SALARIES",
  "UTILITIES",
  "MARKETING",
  "AGGREGATOR_COMMISSION",
  "RENT",
  "MAINTENANCE",
  "OTHER",
];

const getExpenses = async (
  restaurantId: string
) => {
  return prisma.expense.findMany({
    where: {
      restaurantId,
    },
    include: {
      linkedOrder: {
        select: {
          id: true,
          orderNumber: true,
          source: true,
          totalAmount: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
};

const createExpense = async (
  restaurantId: string,
  data: {
    category: string;
    amount: number;
    date?: string;
    recurring?: boolean;
    notes?: string;
    linkedOrderId?: string;
  }
) => {
  if (
    !expenseCategories.includes(
      data.category
    )
  ) {
    throw new Error(
      "Invalid expense category"
    );
  }

  if (
    data.amount === undefined ||
    Number(data.amount) <= 0
  ) {
    throw new Error(
      "Expense amount must be greater than 0"
    );
  }

  if (data.linkedOrderId) {
    const order =
      await prisma.order.findFirst({
        where: {
          id: data.linkedOrderId,
          restaurantId,
        },
      });

    if (!order) {
      throw new Error(
        "Linked order not found"
      );
    }
  }

  return prisma.expense.create({
    data: {
      category: data.category as any,
      amount: Number(data.amount),
      date: data.date
        ? new Date(data.date)
        : new Date(),
      recurring:
        data.recurring ?? false,
      notes: data.notes || null,
      linkedOrderId:
        data.linkedOrderId || null,
      restaurantId,
    },
    include: {
      linkedOrder: {
        select: {
          id: true,
          orderNumber: true,
          source: true,
          totalAmount: true,
        },
      },
    },
  });
};

const updateExpense = async (
  restaurantId: string,
  expenseId: string,
  data: {
    category?: string;
    amount?: number;
    date?: string;
    recurring?: boolean;
    notes?: string;
    linkedOrderId?: string | null;
  }
) => {
  const expense =
    await prisma.expense.findFirst({
      where: {
        id: expenseId,
        restaurantId,
      },
    });

  if (!expense) {
    throw new Error(
      "Expense not found"
    );
  }

  if (
    data.category &&
    !expenseCategories.includes(
      data.category
    )
  ) {
    throw new Error(
      "Invalid expense category"
    );
  }

  if (
    data.amount !== undefined &&
    Number(data.amount) <= 0
  ) {
    throw new Error(
      "Expense amount must be greater than 0"
    );
  }

  if (data.linkedOrderId) {
    const order =
      await prisma.order.findFirst({
        where: {
          id: data.linkedOrderId,
          restaurantId,
        },
      });

    if (!order) {
      throw new Error(
        "Linked order not found"
      );
    }
  }

  return prisma.expense.update({
    where: {
      id: expenseId,
    },
    data: {
      ...(data.category !== undefined && {
        category: data.category as any,
      }),
      ...(data.amount !== undefined && {
        amount: Number(data.amount),
      }),
      ...(data.date !== undefined && {
        date: new Date(data.date),
      }),
      ...(data.recurring !== undefined && {
        recurring: data.recurring,
      }),
      ...(data.notes !== undefined && {
        notes: data.notes || null,
      }),
      ...(data.linkedOrderId !== undefined && {
        linkedOrderId:
          data.linkedOrderId || null,
      }),
    },
    include: {
      linkedOrder: {
        select: {
          id: true,
          orderNumber: true,
          source: true,
          totalAmount: true,
        },
      },
    },
  });
};

const deleteExpense = async (
  restaurantId: string,
  expenseId: string
) => {
  const expense =
    await prisma.expense.findFirst({
      where: {
        id: expenseId,
        restaurantId,
      },
    });

  if (!expense) {
    throw new Error(
      "Expense not found"
    );
  }

  await prisma.expense.delete({
    where: {
      id: expenseId,
    },
  });

  return {
    success: true,
    message:
      "Expense deleted successfully",
  };
};

export {
  expenseCategories,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
