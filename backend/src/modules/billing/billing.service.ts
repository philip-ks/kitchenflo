import prisma from "../../lib/prisma";

const generateInvoiceNumber = () => {
  return `INV-${Date.now()}`;
};

const createInvoice = async (data: any) => {
  const existingInvoice = await prisma.invoice.findUnique({
    where: {
      orderId: data.orderId,
    },
  });

  if (existingInvoice) {
    throw new Error("Invoice already exists for this order");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: data.orderId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.restaurantId !== data.restaurantId) {
    throw new Error("Order does not belong to this restaurant");
  }

  const subtotal = order.totalAmount;
  const taxAmount = data.taxAmount || 0;
  const discount = data.discount || 0;
  const totalAmount = subtotal + taxAmount - discount;

  return prisma.invoice.create({
    data: {
      invoiceNumber: generateInvoiceNumber(),
      restaurantId: data.restaurantId,
      orderId: data.orderId,
      subtotal,
      taxAmount,
      discount,
      totalAmount,
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
      payments: true,
    },
  });
};

const getInvoices = async (restaurantId: string) => {
  return prisma.invoice.findMany({
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
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createPayment = async (data: any) => {
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: data.invoiceId,
    },
    include: {
      payments: true,
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  if (invoice.restaurantId !== data.restaurantId) {
    throw new Error("Invoice does not belong to this restaurant");
  }

  const alreadyPaid = invoice.payments.reduce(
    (sum: number, payment: any) => sum + payment.amount,
    0
  );

  const remainingBalance = invoice.totalAmount - alreadyPaid;

  if (remainingBalance <= 0) {
    throw new Error("Invoice is already fully paid");
  }

  if (data.amount > remainingBalance) {
    throw new Error(
      `Payment exceeds remaining balance. Remaining balance is ${remainingBalance}`
    );
  }

  const payment = await prisma.payment.create({
    data: {
      restaurantId: data.restaurantId,
      invoiceId: data.invoiceId,
      amount: data.amount,
      method: data.method,
      reference: data.reference,
      status: "COMPLETED",
    },
  });

  const totalPaid = alreadyPaid + data.amount;

  if (totalPaid >= invoice.totalAmount) {
    await prisma.invoice.update({
      where: {
        id: data.invoiceId,
      },
      data: {
        status: "PAID",
      },
    });
  }

  return payment;
};

export {
  createInvoice,
  getInvoices,
  createPayment,
};