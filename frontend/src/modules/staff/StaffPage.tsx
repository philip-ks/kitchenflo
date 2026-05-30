import { useEffect, useState } from "react";

import {
  Users,
  Plus,
  Trash2,
  BadgeCheck,
  Phone,
  Mail,
  KeyRound,
} from "lucide-react";

import { api } from "../../services/api";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  restaurantId: string;
  createdAt: string;
};

const roles = [
  "MANAGER",
  "CASHIER",
  "CHEF",
  "WAITER",
];

export default function StaffPage() {
  const [staff, setStaff] =
    useState<StaffMember[]>([]);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      role: "CASHIER",
      pin: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/staff");

      setStaff(response.data.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load staff."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      role: "CASHIER",
      pin: "",
    });
  };

  const createStaff = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (
        !form.name ||
        !form.email ||
        !form.role ||
        !form.pin
      ) {
        setError(
          "Name, email, role and PIN are required."
        );
        return;
      }

      if (form.pin.length < 4) {
        setError(
          "PIN must be at least 4 digits."
        );
        return;
      }

      await api.post("/staff", {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        role: form.role,
        pin: form.pin,
      });

      setMessage(
        "Staff member created successfully."
      );

      resetForm();

      fetchStaff();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create staff."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteStaff = async (
    staffId: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this staff member?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(
        `/staff/${staffId}`
      );

      setMessage(
        "Staff member deleted successfully."
      );

      fetchStaff();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete staff."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Staff Management
        </h1>

        <p className="mt-1 text-slate-500">
          Create staff accounts for cashiers, waiters, chefs, and managers with quick PIN login.
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
        <div className="xl:col-span-1">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Plus size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Staff
                </h2>

                <p className="text-sm text-slate-500">
                  Set role and PIN access.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Staff Name
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="Ravi Cashier"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    type="email"
                    className="w-full rounded-xl border border-slate-300 px-11 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    placeholder="staff@restaurant.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-11 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    placeholder="+919888888888"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Role
                </label>

                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  {roles.map((role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Staff PIN
                </label>

                <div className="relative">
                  <KeyRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={form.pin}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pin: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-11 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    placeholder="1234"
                    maxLength={8}
                  />
                </div>
              </div>

              <button
                onClick={createStaff}
                disabled={saving}
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving
                  ? "Creating..."
                  : "Create Staff"}
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Users size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Staff List
                </h2>

                <p className="text-sm text-slate-500">
                  Staff members who can access KitchenFlo using PIN login.
                </p>
              </div>
            </div>

            {loading ? (
              <p className="text-slate-500">
                Loading staff...
              </p>
            ) : staff.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No staff members added yet.
              </div>
            ) : (
              <div className="space-y-3">
                {staff.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {member.name}
                        </p>

                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {member.role}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1 text-sm text-slate-500">
                        <p>
                          {member.email}
                        </p>

                        {member.phone && (
                          <p>
                            {member.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        deleteStaff(member.id)
                      }
                      className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            <div className="flex items-start gap-3">
              <BadgeCheck size={20} />

              <div>
                <p className="font-semibold">
                  Staff PIN Login
                </p>

                <p className="mt-2">
                  Staff members can log in using the restaurant ID and their assigned PIN. Later, this can be simplified using a branch code or device-specific login.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
