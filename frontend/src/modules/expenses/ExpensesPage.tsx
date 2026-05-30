import { useEffect, useState } from "react";

import {
  ReceiptText,
  Plus,
  Trash2,
  IndianRupee,
  CalendarDays,
} from "lucide-react";

import { api } from "../../services/api";

type Expense = {
  id: string;
  category: string;
  amount: number;
  date: string;
  recurring: boolean;
  notes?: string;
  linkedOrderId?: string;
  restaurantId: string;
};

const defaultCategories = [
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

export default function ExpensesPage() {
  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [categories, setCategories] =
    useState<string[]>(
      defaultCategories
    );

  const [form, setForm] =
    useState({
      category: "PACKAGING",
      amount: "",
      date: "",
      recurring: false,
      notes: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const fetchCategories = async () => {
    try {
      const response =
        await api.get(
          "/expenses/categories"
        );

      setCategories(
        response.data.data ||
          defaultCategories
      );
    } catch {
      setCategories(
        defaultCategories
      );
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/expenses");

      setExpenses(
        response.data.data || []
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load expenses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    );

  const createExpense = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!form.category) {
        setError(
          "Expense category is required."
        );
        return;
      }

      if (
        !form.amount ||
        Number(form.amount) <= 0
      ) {
        setError(
          "Amount must be greater than 0."
        );
        return;
      }

      await api.post("/expenses", {
        category: form.category,
        amount: Number(form.amount),
        date: form.date || undefined,
        recurring: form.recurring,
        notes:
          form.notes.trim() ||
          undefined,
      });

      setForm({
        category: "PACKAGING",
        amount: "",
        date: "",
        recurring: false,
        notes: "",
      });

      setMessage(
        "Expense created successfully."
      );

      fetchExpenses();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create expense."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteExpense = async (
    expenseId: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this expense?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(
        `/expenses/${expenseId}`
      );

      setMessage(
        "Expense deleted successfully."
      );

      fetchExpenses();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete expense."
      );
    }
  };

  const formatDate = (
    date: string
  ) => {
    try {
      return new Date(
        date
      ).toLocaleDateString();
    } catch {
      return date;
    }
  };

  const formatCategory = (
    category: string
  ) => {
    return category
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Expenses
        </h1>

        <p className="mt-1 text-slate-500">
          Track raw materials, packaging, salaries, utilities, aggregator commission, rent, and other costs.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Plus size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Expense
                </h2>

                <p className="text-sm text-slate-500">
                  Record fixed and variable operating costs.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {formatCategory(
                          category
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                </label>

                <div className="relative">
                  <IndianRupee
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount:
                          e.target.value,
                      })
                    }
                    type="number"
                    min="0"
                    className="w-full rounded-xl border border-slate-300 px-11 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    placeholder="150"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date:
                          e.target.value,
                      })
                    }
                    type="date"
                    className="w-full rounded-xl border border-slate-300 px-11 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Recurring Expense
                </span>

                <input
                  type="checkbox"
                  checked={form.recurring}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      recurring:
                        e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </label>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes:
                        e.target.value,
                    })
                  }
                  className="min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="Burger boxes and paper bags"
                />
              </div>

              <button
                onClick={createExpense}
                disabled={saving}
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : "Save Expense"}
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Expenses
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                ₹{totalExpenses.toFixed(2)}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Entries
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {expenses.length}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Recurring
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {
                  expenses.filter(
                    (expense) =>
                      expense.recurring
                  ).length
                }
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <ReceiptText size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Expense List
                </h2>

                <p className="text-sm text-slate-500">
                  Track costs for profitability and daily reporting.
                </p>
              </div>
            </div>

            {loading ? (
              <p className="text-slate-500">
                Loading expenses...
              </p>
            ) : expenses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No expenses added yet.
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map(
                  (expense) => (
                    <div
                      key={expense.id}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">
                            {formatCategory(
                              expense.category
                            )}
                          </p>

                          {expense.recurring && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              Recurring
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          {formatDate(
                            expense.date
                          )}
                        </p>

                        {expense.notes && (
                          <p className="mt-1 text-sm text-slate-500">
                            {expense.notes}
                          </p>
                        )}

                        <p className="mt-2 max-w-md truncate font-mono text-xs text-slate-400">
                          {expense.id}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold text-slate-900">
                          ₹
                          {Number(
                            expense.amount
                          ).toFixed(2)}
                        </p>

                        <button
                          onClick={() =>
                            deleteExpense(
                              expense.id
                            )
                          }
                          className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
