import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Receipt, CreditCard } from "lucide-react";
import { api } from "../../services/api";

type Order = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  table?: {
    name: string;
  };
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  status: "UNPAID" | "PAID" | "CANCELLED";
  order: Order;
  payments: {
    id: string;
    amount: number;
    method: string;
    reference?: string;
  }[];
};

export default function BillingPage() {
  const navigate = useNavigate();

  const restaurantId = localStorage.getItem("kitchenflo_restaurant_id");

  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [taxAmount, setTaxAmount] = useState("0");
  const [discount, setDiscount] = useState("0");

  const [paymentInvoiceId, setPaymentInvoiceId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [reference, setReference] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!restaurantId) return;

    const [ordersRes, invoicesRes] = await Promise.all([
      api.get(`/orders/${restaurantId}`),
      api.get(`/billing/invoices/${restaurantId}`),
    ]);

    setOrders(ordersRes.data.data);
    setInvoices(invoicesRes.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createInvoice = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!restaurantId || !selectedOrderId) {
      setMessage("Please select an order");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.post("/billing/invoices", {
        restaurantId,
        orderId: selectedOrderId,
        taxAmount: Number(taxAmount),
        discount: Number(discount),
      });

      setSelectedOrderId("");
      setTaxAmount("0");
      setDiscount("0");
      setMessage("Invoice created successfully");

      await fetchData();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!restaurantId || !paymentInvoiceId || !paymentAmount) {
      setMessage("Please select invoice and enter amount");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.post("/billing/payments", {
        restaurantId,
        invoiceId: paymentInvoiceId,
        amount: Number(paymentAmount),
        method: paymentMethod,
        reference,
      });

      setPaymentInvoiceId("");
      setPaymentAmount("");
      setReference("");
      setMessage("Payment recorded successfully");

      await fetchData();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  const invoiceStatusClass = (status: string) => {
    if (status === "PAID") return "bg-green-100 text-green-700";
    if (status === "UNPAID") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const completedOrdersWithoutInvoice = orders.filter((order) => {
    const alreadyInvoiced = invoices.some(
      (invoice) => invoice.order.id === order.id
    );

    return order.status === "COMPLETED" && !alreadyInvoiced;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Billing & Invoices
            </h1>
            <p className="text-sm text-slate-500">
              Create invoices and record payments
            </p>
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Receipt size={20} />
              <h2 className="font-bold text-slate-900">
                Create Invoice
              </h2>
            </div>

            <form onSubmit={createInvoice} className="space-y-4">
              <select
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
              >
                <option value="">Select completed order</option>
                {completedOrdersWithoutInvoice.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.orderNumber} · ₹{order.totalAmount}
                  </option>
                ))}
              </select>

              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                type="number"
                placeholder="Tax Amount"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
              />

              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                type="number"
                placeholder="Discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />

              <button
                disabled={loading}
                className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 font-semibold disabled:opacity-60"
              >
                Create Invoice
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} />
              <h2 className="font-bold text-slate-900">
                Record Payment
              </h2>
            </div>

            <form onSubmit={createPayment} className="space-y-4">
              <select
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                value={paymentInvoiceId}
                onChange={(e) => {
                  const invoiceId = e.target.value;
                  setPaymentInvoiceId(invoiceId);

                  const invoice = invoices.find((item) => item.id === invoiceId);
                  if (invoice) {
                    setPaymentAmount(String(invoice.totalAmount));
                  }
                }}
              >
                <option value="">Select unpaid invoice</option>
                {invoices
                  .filter((invoice) => invoice.status === "UNPAID")
                  .map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} · ₹{invoice.totalAmount}
                    </option>
                  ))}
              </select>

              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                type="number"
                placeholder="Amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />

              <select
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="UPI">UPI</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="WALLET">Wallet</option>
                <option value="OTHER">Other</option>
              </select>

              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
                placeholder="Reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />

              <button
                disabled={loading}
                className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 font-semibold disabled:opacity-60"
              >
                Record Payment
              </button>
            </form>
          </div>

          {message && (
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          )}
        </section>

        <section className="xl:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Invoices
            </h2>
            <p className="text-sm text-slate-500">
              {invoices.length} invoices found
            </p>
          </div>

          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {invoice.invoiceNumber}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Order: {invoice.order.orderNumber} ·{" "}
                      {invoice.order.table?.name || "No Table"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${invoiceStatusClass(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 text-sm">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-slate-500">Subtotal</div>
                    <div className="font-bold">₹{invoice.subtotal}</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-slate-500">Tax</div>
                    <div className="font-bold">₹{invoice.taxAmount}</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-slate-500">Discount</div>
                    <div className="font-bold">₹{invoice.discount}</div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-lg p-3">
                    <div className="text-slate-300">Total</div>
                    <div className="font-bold">₹{invoice.totalAmount}</div>
                  </div>
                </div>

                {invoice.payments.length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <h4 className="text-sm font-bold text-slate-800 mb-2">
                      Payments
                    </h4>

                    {invoice.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="text-sm text-slate-600 flex justify-between"
                      >
                        <span>
                          {payment.method}
                          {payment.reference ? ` · ${payment.reference}` : ""}
                        </span>
                        <span>₹{payment.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {invoices.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-slate-500">
                No invoices found.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
