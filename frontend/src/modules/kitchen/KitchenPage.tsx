import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChefHat,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { api } from "../../services/api";
import { socket } from "../../services/socket";

type KitchenTicket = {
  id: string;
  ticketNumber: string;
  status:
    | "PENDING"
    | "PREPARING"
    | "READY"
    | "COMPLETED";

  notes?: string;

  order: {
    id: string;
    orderNumber: string;

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

  createdAt: string;
};

export default function KitchenPage() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<
    KitchenTicket[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const restaurantId =
    localStorage.getItem(
      "kitchenflo_restaurant_id"
    );

  const fetchTickets = async () => {
    try {
      const response = await api.get(
        `/kitchen/tickets/${restaurantId}`
      );

      setTickets(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    socket.on("new-order", () => {
      fetchTickets();
    });

    socket.on(
      "order-status-updated",
      () => {
        fetchTickets();
      }
    );

    return () => {
      socket.off("new-order");

      socket.off(
        "order-status-updated"
      );
    };
  }, []);

  const updateStatus = async (
    ticketId: string,
    status: string
  ) => {
    try {
      await api.patch(
        `/kitchen/tickets/${ticketId}/status`,
        {
          status,
        }
      );

      fetchTickets();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="bg-slate-100 p-2 rounded-xl"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="bg-slate-900 text-white p-2 rounded-xl">
            <ChefHat size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Kitchen Display System
            </h1>

            <p className="text-sm text-slate-500">
              Live kitchen order flow
            </p>
          </div>
        </div>
      </header>

      <main className="p-6">
        {loading ? (
          <div className="text-slate-500">
            Loading kitchen tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
            No kitchen tickets found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      {
                        ticket.ticketNumber
                      }
                    </h2>

                    <p className="text-sm text-slate-500">
                      {
                        ticket.order
                          .orderNumber
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-full">
                    <Clock size={12} />

                    {ticket.status}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {ticket.order.items.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {
                            item.menuItem
                              .name
                          }
                        </span>

                        <span className="font-semibold">
                          ×{" "}
                          {
                            item.quantity
                          }
                        </span>
                      </div>
                    )
                  )}
                </div>

                {ticket.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800 mb-4">
                    {ticket.notes}
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() =>
                      updateStatus(
                        ticket.id,
                        "PREPARING"
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm"
                  >
                    Preparing
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        ticket.id,
                        "READY"
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm"
                  >
                    Ready
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        ticket.id,
                        "COMPLETED"
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}