import { useEffect, useState } from "react";

import {
  Store,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import { api } from "../../services/api";

type Brand = {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  restaurantId: string;
  createdAt: string;
};

export default function BrandsPage() {
  const [brands, setBrands] =
    useState<Brand[]>([]);

  const [form, setForm] =
    useState({
      name: "",
      description: "",
      active: true,
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/brands");

      setBrands(response.data.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load brands."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const createBrand = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!form.name.trim()) {
        setError("Brand name is required.");
        return;
      }

      await api.post("/brands", {
        name: form.name.trim(),
        description:
          form.description.trim() ||
          undefined,
        active: form.active,
      });

      setForm({
        name: "",
        description: "",
        active: true,
      });

      setMessage(
        "Brand created successfully."
      );

      fetchBrands();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create brand."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleBrand = async (
    brand: Brand
  ) => {
    try {
      setError("");
      setMessage("");

      await api.put(
        `/brands/${brand.id}`,
        {
          active: !brand.active,
        }
      );

      setMessage(
        brand.active
          ? "Brand deactivated."
          : "Brand activated."
      );

      fetchBrands();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update brand."
      );
    }
  };

  const deleteBrand = async (
    brandId: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this brand? If it is linked to menu items or orders, it will be deactivated instead."
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(
        `/brands/${brandId}`
      );

      setMessage(
        "Brand removed successfully."
      );

      fetchBrands();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete brand."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Brands
        </h1>

        <p className="mt-1 text-slate-500">
          Manage multiple cloud-kitchen brands under one restaurant operation.
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
                  Add Brand
                </h2>

                <p className="text-sm text-slate-500">
                  Create a new restaurant or cloud-kitchen brand.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Brand Name
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
                  placeholder="KitchenFlo Burgers"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="Burger cloud kitchen brand"
                />
              </div>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Active
                </span>

                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      active:
                        e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </label>

              <button
                onClick={createBrand}
                disabled={saving}
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving
                  ? "Creating..."
                  : "Create Brand"}
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Store size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Brand List
                </h2>

                <p className="text-sm text-slate-500">
                  Brands available for menu mapping and order tracking.
                </p>
              </div>
            </div>

            {loading ? (
              <p className="text-slate-500">
                Loading brands...
              </p>
            ) : brands.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No brands added yet.
              </div>
            ) : (
              <div className="space-y-3">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {brand.name}
                        </p>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            brand.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {brand.active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      {brand.description && (
                        <p className="mt-2 text-sm text-slate-500">
                          {brand.description}
                        </p>
                      )}

                      <p className="mt-2 max-w-md truncate font-mono text-xs text-slate-400">
                        {brand.id}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          toggleBrand(brand)
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 hover:bg-slate-100"
                      >
                        {brand.active ? (
                          <ToggleRight size={18} />
                        ) : (
                          <ToggleLeft size={18} />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          deleteBrand(
                            brand.id
                          )
                        }
                        className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
