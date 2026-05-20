import prisma from "../../lib/prisma";

const getDailySalesReport = async (restaurantId: string) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const invoices = await prisma.invoice.findMany({
    where: {
      restaurantId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      payments: true,
    },
  });

  const payments = await prisma.payment.findMany({
    where: {
      restaurantId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: "COMPLETED",
    },
  });

  const totalSales = invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "PAID"
  ).length;

  const unpaidInvoices = invoices.filter(
    (invoice) => invoice.status === "UNPAID"
  ).length;

  const methodTotals = {
    cashTotal: 0,
    upiTotal: 0,
    cardTotal: 0,
    walletTotal: 0,
    otherTotal: 0,
  };

  payments.forEach((payment) => {
    if (payment.method === "CASH") {
      methodTotals.cashTotal += payment.amount;
    }

    if (payment.method === "UPI") {
      methodTotals.upiTotal += payment.amount;
    }

    if (payment.method === "CARD") {
      methodTotals.cardTotal += payment.amount;
    }

    if (payment.method === "WALLET") {
      methodTotals.walletTotal += payment.amount;
    }

    if (payment.method === "OTHER") {
      methodTotals.otherTotal += payment.amount;
    }
  });

  return {
    date: startOfDay.toISOString().split("T")[0],

    restaurantId,

    totalSales,

    totalInvoices: invoices.length,

    paidInvoices,

    unpaidInvoices,

    paymentCount: payments.length,

    ...methodTotals,
  };
};

export { getDailySalesReport };
