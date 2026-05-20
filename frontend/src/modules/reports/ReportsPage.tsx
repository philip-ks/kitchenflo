import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  CreditCard,
  IndianRupee,
  Receipt,
  Wallet,
} from "lucide-react";
import { api } from "../../services/api";

type DailySalesReport = {
  date: string;
  restaurantId: string;
  totalSales: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  paymentCount: number;
  cashTotal: number;
  upiTotal: number;
  cardTotal: number;
  walletTotal: number;
  otherTotal: number;
};

export default function ReportsPage() {
  const navigate = useNavigate();

  const restaurantId = localStorage.getItem("kitchenflo_restaurant_id");

  const [report, setReport] = useState<DailySalesReport | null>(null);
  const [message, setMessage] = useState("");

  const fetchReport = async () => {
    if (!restaurantId) return;

    try {
      setMessage("");

      const response = await api.get(
        `/reports/daily-sales/${restaurantId}`
      );

      setReport(response.data.data);
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message || "Failed to fetch report"
      );
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const cards = report
    ? [
        {
          title: "Total Sales",
          value: `₹${report.totalSales}`,
          description: "Paid invoice revenue",
          icon: IndianRupee,
        },
        {
          title: "Total Invoices",
          value: report.totalInvoices,
          description: "Invoices created today",
          icon: Receipt,
        },
        {
          title: "Paid Invoices",
          value: report.paidInvoices,
          description: "Completed billing",
          icon: CreditCard,
        },
        {
          title: "Unpaid Invoices",
          value: report.unpaidInvoices,
          description: "Pending collections",
          icon: Wallet,
        },
      ]
    : [];

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
              Reports
            </h1>
            <p className="text-sm text-slate-500">
              Daily sales and payment analytics
            </p>
          </div>
        </div>

        <button
          onClick={fetchReport}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Refresh
        </button>
      </header>

      <main className="p-6">
        {message && (
          <div className="mb-5 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">
            {message}
          </div>
        )}

        {!report && !message && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-slate-500">
            Loading report...
          </div>
        )}

        {report && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Daily Sales Report
              </h2>
              <p className="text-slate-500 mt-1">
                Report date: {report.date}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                  >
                    <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                      <Icon size={22} />
                    </div>

                    <h3 className="text-sm text-slate-500">
                      {card.title}
                    </h3>

                    <div className="text-2xl font-bold text-slate-900 mt-1">
                      {card.value}
                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 size={20} />
                <h2 className="font-bold text-slate-900">
                  Payment Method Breakdown
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">UPI</p>
                  <p className="text-xl font-bold text-slate-900">
                    ₹{report.upiTotal}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Cash</p>
                  <p className="text-xl font-bold text-slate-900">
                    ₹{report.cashTotal}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Card</p>
                  <p className="text-xl font-bold text-slate-900">
                    ₹{report.cardTotal}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Wallet</p>
                  <p className="text-xl font-bold text-slate-900">
                    ₹{report.walletTotal}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Other</p>
                  <p className="text-xl font-bold text-slate-900">
                    ₹{report.otherTotal}
                  </p>
                </div>
              </div>

              <div className="mt-5 text-sm text-slate-500">
                Payment count today:{" "}
                <span className="font-bold text-slate-900">
                  {report.paymentCount}
                </span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
