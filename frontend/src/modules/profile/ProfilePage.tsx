import { useEffect, useState } from "react";

import {
  User,
  Building2,
  ShieldCheck,
  Save,
  Phone,
  Mail,
  BadgeCheck,
} from "lucide-react";

import { api } from "../../services/api";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  restaurantId: string;
};

type RestaurantProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export default function ProfilePage() {
  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [restaurant, setRestaurant] =
    useState<RestaurantProfile | null>(null);

  const [userForm, setUserForm] =
    useState({
      name: "",
      phone: "",
    });

  const [restaurantForm, setRestaurantForm] =
    useState({
      name: "",
      phone: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [savingUser, setSavingUser] =
    useState(false);

  const [savingRestaurant, setSavingRestaurant] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/profile/me");

      const profileUser =
        response.data.data.user;

      const profileRestaurant =
        response.data.data.restaurant;

      setUser(profileUser);
      setRestaurant(profileRestaurant);

      setUserForm({
        name: profileUser?.name || "",
        phone: profileUser?.phone || "",
      });

      setRestaurantForm({
        name: profileRestaurant?.name || "",
        phone: profileRestaurant?.phone || "",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateUserProfile = async () => {
    try {
      setSavingUser(true);
      setError("");
      setMessage("");

      const response =
        await api.put("/profile/me", {
          name: userForm.name,
          phone: userForm.phone,
        });

      setUser(response.data.data);

      const storedUser = JSON.parse(
        localStorage.getItem(
          "kitchenflo_user"
        ) || "{}"
      );

      localStorage.setItem(
        "kitchenflo_user",
        JSON.stringify({
          ...storedUser,
          name: response.data.data.name,
          phone: response.data.data.phone,
        })
      );

      setMessage(
        "User profile updated successfully."
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update user profile."
      );
    } finally {
      setSavingUser(false);
    }
  };

  const updateRestaurantDetails = async () => {
    try {
      setSavingRestaurant(true);
      setError("");
      setMessage("");

      const response =
        await api.put("/profile/restaurant", {
          name: restaurantForm.name,
          phone: restaurantForm.phone,
        });

      setRestaurant(response.data.data);

      setMessage(
        "Restaurant profile updated successfully."
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update restaurant profile."
      );
    } finally {
      setSavingRestaurant(false);
    }
  };

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Profile
        </h1>

        <p className="mt-1 text-slate-500">
          Manage your user account, restaurant details, and login methods.
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
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <User size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Personal Details
                </h2>

                <p className="text-sm text-slate-500">
                  Update your account name and mobile number.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
                  <Mail size={18} />
                  <span className="text-sm">
                    {user?.email}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Mobile Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={userForm.phone}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        phone: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-11 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    placeholder="+919999999999"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={updateUserProfile}
              disabled={savingUser}
              className="mt-5 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              <Save size={18} />
              {savingUser
                ? "Saving..."
                : "Save Personal Details"}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Building2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Restaurant Details
                </h2>

                <p className="text-sm text-slate-500">
                  Manage your restaurant profile information.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Restaurant Name
                </label>

                <input
                  value={restaurantForm.name}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="Restaurant name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Restaurant Email
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
                  <Mail size={18} />
                  <span className="text-sm">
                    {restaurant?.email}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Restaurant Phone
                </label>

                <input
                  value={restaurantForm.phone}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      phone: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="+919999999999"
                />
              </div>
            </div>

            <button
              onClick={updateRestaurantDetails}
              disabled={savingRestaurant}
              className="mt-5 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              <Save size={18} />
              {savingRestaurant
                ? "Saving..."
                : "Save Restaurant Details"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <BadgeCheck size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Account Summary
                </h2>

                <p className="text-sm text-slate-500">
                  Your current access details.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  Role
                </span>

                <span className="font-semibold text-slate-900">
                  {user?.role}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  User ID
                </span>

                <span className="max-w-[160px] truncate font-mono text-xs text-slate-700">
                  {user?.id}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  Restaurant ID
                </span>

                <span className="max-w-[160px] truncate font-mono text-xs text-slate-700">
                  {user?.restaurantId}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Login Methods
                </h2>

                <p className="text-sm text-slate-500">
                  Enabled access options.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {[
                "Email / Password",
                "Google",
                "Microsoft",
                "GitHub",
                "Mobile OTP",
              ].map((method) => (
                <div
                  key={method}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                >
                  <span>{method}</span>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Enabled
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            <p className="font-semibold">
              Note
            </p>

            <p className="mt-2">
              Mobile OTP is currently in development mode.
              OTP codes are printed in the backend terminal.
              Later, this can be connected to WhatsApp or SMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
