import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChefHat } from "lucide-react";
import { api } from "../../services/api";

type KitchenTicket = {
  id: string;
  ticketNumber: string;
  status: "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
  notes?: string;
  order: {
    orderNumber: string;
    totalAmount: number;
    table?: {
      name: string;
    };
    items: {
      id: string;
      quantity: number;
      menuItem: {
        name: string;
      };
    }[];
  };
};

export default function KitchenPage() {
  const navigate = useNavigate();

  const restaurantId = localStorage.getItem("kitchenflo_restaurant_id");

  const [tickets, setTickets] = useState<KitchenTicket[]>([]);
  const [message, setMessage] = useState("");

  const fetchTickets = async () => {
    if (!restaurantId) return;

    const response = await api.get(`/kitchen/tickets/${restaurantId}`);
    setTickets(response.data.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (
    ticketId: string,
    status: KitchenTicket["status"]
  ) => {
    try {
      setMessage("");

      await api.patch(`/kitchen/tickets/${ticketId}/status`, {
        status,
      });

      setMessage(`Ticket moved to ${status}`);
      await fetchTickets();
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message || "Failed to update ticket"
      );
    }
  };

  const statusClass = (status: string) => {
    if (status === "PENDING") return "bg-yellow-100 text-yellow-700";
    if (status === "PREPARING") return "bg-blue-100 text-blue-700";
    if (status === "READY") return "bg-green-100 text-green-700";
    if (status === "COMPLETED") return "bg-slate-100 text-slate-700";
    return "bg-red-100 text-red-700";
  };

  const nextAction = (ticket: KitchenTicket) => {
    if (ticket.status === "PENDING") {
      return (
        <button
          onClick={() => updateStatus(ticket.id, "PREPARING")}
          className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Start Preparing
        </button>
      );
    }

    if (ticket.status === "PREPARING") {
      return (
        <button
          onClick={() => updateStatus(ticket.id, "READY")}
          className="bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Mark Ready
        </button>
      );
    }

    if (ticket.status === "READY") {
      return (
        <button
          onClick={() => updateStatus(ticket.id, "COMPLETED")}
          className="bg-slate-700 text-white rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Complete
        </button>
      );
    }

    return null;
  };

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
              Kitchen Tickets
            </h1>
            <p className="text-sm text-slate-500">
              Track KOT status from pending to ready
            </p>
          </div>
        </div>
      </header>

      <main className="p-6">
        {message && (
          <div className="mb-5 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <ChefHat size={22} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      {ticket.ticketNumber}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {ticket.order?.table?.name || "No Table"} ·{" "}
                      {ticket.order?.orderNumber}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${statusClass(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="space-y-3">
                {ticket.order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b border-slate-100 pb-2"
                  >
                    <span className="font-medium text-slate-800">
                      {item.menuItem.name}
                    </span>
                    <span className="text-slate-500">
                      × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {ticket.notes && (
                <div className="mt-4 bg-yellow-50 text-yellow-800 rounded-lg p-3 text-sm">
                  Note: {ticket.notes}
                </div>
              )}

              <div className="mt-5">
                {nextAction(ticket)}
              </div>
            </div>
          ))}

          {tickets.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-slate-500">
              No kitchen tickets found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
