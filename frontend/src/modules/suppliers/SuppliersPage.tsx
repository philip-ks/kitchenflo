import { useEffect, useState } from "react";

import {
  Truck,
  Plus,
  Phone,
  Mail,
} from "lucide-react";

import { api } from "../../services/api";

type Supplier = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      email: "",
    });

  const restaurantId =
    localStorage.getItem(
      "kitchenflo_restaurant_id"
    );

  const fetchSuppliers =
    async () => {
      try {
        const response =
          await api.get(
            `/inventory/suppliers/${restaurantId}`
          );

        setSuppliers(
          response.data.data || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const createSupplier =
    async () => {
      try {
        await api.post(
          "/inventory/suppliers",
          {
            ...formData,
            restaurantId,
          }
        );

        setFormData({
          name: "",
          phone: "",
          email: "",
        });

        setShowForm(false);

        fetchSuppliers();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Suppliers
          </h1>

          <p className="text-slate-500 mt-1">
            Manage procurement vendors
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl"
        >
          <Plus size={18} />
          Add Supplier
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">
            Add Supplier
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Supplier Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="border border-slate-300 rounded-xl px-4 py-3"
            />

            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              className="border border-slate-300 rounded-xl px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="border border-slate-300 rounded-xl px-4 py-3"
            />
          </div>

          <button
            onClick={createSupplier}
            className="mt-4 bg-slate-900 text-white px-5 py-3 rounded-xl"
          >
            Save Supplier
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-slate-500">
          Loading suppliers...
        </div>
      ) : suppliers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Truck
            className="mx-auto text-slate-400 mb-4"
            size={48}
          />

          <h3 className="text-lg font-semibold text-slate-900">
            No Suppliers Found
          </h3>

          <p className="text-slate-500 mt-2">
            Start adding vendors
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <div className="bg-slate-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                <Truck
                  className="text-slate-900"
                  size={24}
                />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                {supplier.name}
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={16} />
                    {supplier.phone}
                  </div>
                )}

                {supplier.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={16} />
                    {supplier.email}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}