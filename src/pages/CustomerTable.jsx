// File: CustomerTable.jsx (Modern UI, no external icon deps)
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

// =================== Config ===================
const API_BASE_URL = "https://insurances-lmy8.onrender.com"; // points to your API
const ROLES = ["customer", "agent", "admin"];
const STATUSES = ["active", "inactive"];

// =============== Inline SVG Icons ===============
const Icon = {
  User: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 19.5a6.5 6.5 0 0113 0M12 12.5a4 4 0 100-8 4 4 0 000 8z"/>
    </svg>
  ),
  Users: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1"/>
      <circle cx="9" cy="7" r="4"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-1a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Search: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7"/>
      <path strokeLinecap="round" d="M21 21l-3.8-3.8"/>
    </svg>
  ),
  Filter: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h12M10 19h4"/>
    </svg>
  ),
  Plus: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Edit: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 4h2m7 7h-2m-7 7h-2m-7-7h2"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5l4 4L9 19l-4 1 1-4 10.5-12.5z"/>
    </svg>
  ),
  Trash: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5-3h4m-9 3h14"/>
    </svg>
  ),
  ChevronDown: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/>
    </svg>
  ),
  Spinner: ({ className = "w-10 h-10" }) => (
    <svg className={`${className} animate-spin`} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" strokeWidth="5" stroke="currentColor" fill="none" opacity="0.2" />
      <path d="M45 25a20 20 0 00-20-20" stroke="currentColor" strokeWidth="5" fill="none" />
    </svg>
  ),
  ImagePlaceholder: ({ className = "w-10 h-10" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M8 13l2.5 2.5L15 11l4 5H5l3-3z"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
    </svg>
  ),
};

// =============== Utility: Badges ===============
const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-emerald-100/70 text-emerald-700 border-emerald-300",
    inactive: "bg-rose-100/70 text-rose-700 border-rose-300",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border font-medium ${map[status] || "bg-gray-100 text-gray-700 border-gray-300"}`}>
      <span className="block w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};

const RoleBadge = ({ role }) => {
  const map = {
    admin: "bg-purple-100/70 text-purple-700 border-purple-300",
    agent: "bg-blue-100/70 text-blue-700 border-blue-300",
    customer: "bg-gray-100/70 text-gray-700 border-gray-300",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border font-medium ${map[role] || "bg-gray-100 text-gray-700 border-gray-300"}`}>
      {role}
    </span>
  );
};

// =============== Main Component ===============
const CustomerTable = () => {
  const { user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ---------------- API Helper ----------------
  const makeApiCall = async (endpoint, method, body = null) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {},
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  };

  // ---------------- Fetch Customers ----------------
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await makeApiCall("/customer", "GET");
      const arr = Array.isArray(data) ? data : [data];
      setCustomers(arr);
      setFilteredCustomers(arr);
    } catch (err) {
      console.error(err);
      // Optional: sample fallback so UI still renders nicely
      const sample = [
        { _id: "1", name: "Ayesha Akter", email: "ayesha@example.com", phone: "+880170000000", status: "active", role: "customer", photo: "" },
        { _id: "2", name: "Rakib Hasan", email: "rakib@example.com", phone: "+880180000000", status: "inactive", role: "agent", photo: "" },
        { _id: "3", name: "Sadia Noor", email: "sadia@example.com", phone: "+880190000000", status: "active", role: "admin", photo: "" },
      ];
      setCustomers(sample);
      setFilteredCustomers(sample);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- Filter & Search ----------------
  useEffect(() => {
    let result = [...customers];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((c) => c.status === statusFilter);
    if (roleFilter !== "all") result = result.filter((c) => c.role === roleFilter);
    setFilteredCustomers(result);
  }, [searchTerm, statusFilter, roleFilter, customers]);

  // ---------------- Edit / Save ----------------
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({ ...customer });
  };

  const handleSave = async () => {
    try {
      await makeApiCall(`/customer/${editingCustomer._id}`, "PUT", formData);
      Swal.fire("Success!", "Customer updated.", "success");
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      Swal.fire("Error!", "Update failed.", "error");
    }
  };

  // ---------------- Delete ----------------
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        await makeApiCall(`/customer/${id}`, "DELETE");
        Swal.fire("Deleted!", "Customer removed.", "success");
        setCustomers((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        Swal.fire("Error!", "Delete failed.", "error");
      }
    }
  };

  // ---------------- Inline Status & Role ----------------
  const handleStatusChange = async (id, newStatus) => {
    try {
      await makeApiCall(`/customer/${id}/status`, "PATCH", { status: newStatus });
      setCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
    } catch (err) {
      console.error(err);
    }
  };
  const handleRoleChange = async (id, newRole) => {
    try {
      await makeApiCall(`/customer/${id}/role`, "PATCH", { role: newRole });
      setCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, role: newRole } : c)));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- Stats ----------------
  const total = customers.length;
  const activeCount = customers.filter((c) => c.status === "active").length;
  const inactiveCount = customers.filter((c) => c.status === "inactive").length;
  const adminCount = customers.filter((c) => c.role === "admin").length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/60 backdrop-blur border border-white/60 shadow-sm">
              <Icon.Users className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Customer Management</h2>
              <p className="text-sm text-slate-500">Manage roles, statuses, and contact information</p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-sky-500 shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 active:scale-[.98] transition"
          >
            <Icon.Plus className="w-5 h-5" />
            Add Customer
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Customers", value: total },
            { label: "Active", value: activeCount },
            { label: "Inactive", value: inactiveCount },
            { label: "Admins", value: adminCount },
          ].map((s, i) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur border border-white/60 shadow-sm hover:shadow-md transition group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-indigo-50/40 to-sky-50/40 pointer-events-none" />
              <div className="p-5">
                <div className="text-sm text-slate-500">{s.label}</div>
                <div className="mt-2 text-3xl font-semibold text-slate-900">{s.value}</div>
              </div>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-2xl opacity-0 group-hover:opacity-100 transition" />
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur shadow-sm">
          <div className="p-4 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex items-center gap-2 flex-1">
              <span className="p-2 rounded-xl bg-slate-100"><Icon.Search className="w-5 h-5 text-slate-500" /></span>
              <input
                type="text"
                aria-label="Search customers by name or email"
                placeholder="Search by name or email..."
                className="w-full border border-slate-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 rounded-xl px-3 py-2 bg-white/80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              <Icon.Filter className="w-5 h-5" />
              Filters
              <Icon.ChevronDown className={`w-4 h-4 transition ${filtersOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Collapsible filter body */}
          {filtersOpen && (
            <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <label className="text-sm text-slate-600">
                <span className="mb-1 block">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white/80 focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="all">All Status</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-600">
                <span className="mb-1 block">Role</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white/80 focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="all">All Roles</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => { setStatusFilter("all"); setRoleFilter("all"); setSearchTerm(""); }}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Icon.Spinner className="w-10 h-10 text-indigo-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCustomers.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-white/60 bg-white/70 backdrop-blur shadow-sm">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 grid place-items-center">
              <Icon.User className="w-7 h-7 text-slate-400" />
            </div>
            <p className="mt-4 text-slate-700 font-medium">No customers found</p>
            <p className="text-sm text-slate-500">Try adjusting your filters or search term.</p>
            <button
              type="button"
              onClick={() => { setStatusFilter("all"); setRoleFilter("all"); setSearchTerm(""); }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-slate-900 hover:bg-slate-800"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && filteredCustomers.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-white/60 bg-white/80 backdrop-blur shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50/70">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c, idx) => (
                  <tr
                    key={c._id}
                    className={`border-t border-slate-100 hover:bg-slate-50/70 transition ${idx % 2 === 0 ? "bg-white/0" : "bg-slate-50/40"}`}
                  >
                    <td className="px-4 py-3">
                      {c.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.photo}
                          alt={c.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/40"; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-100 grid place-items-center text-slate-400">
                          <Icon.ImagePlaceholder className="w-6 h-6" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.email}</td>
                    <td className="px-4 py-3 text-slate-600">{c.phone}</td>

                    {/* Status with select */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={c.status} />
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c._id, e.target.value)}
                          className="border border-slate-200 rounded-lg px-2 py-1 bg-white/80 focus:ring-2 focus:ring-indigo-400 text-xs"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Role with select */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <RoleBadge role={c.role} />
                        <select
                          value={c.role}
                          onChange={(e) => handleRoleChange(c._id, e.target.value)}
                          className="border border-slate-200 rounded-lg px-2 py-1 bg-white/80 focus:ring-2 focus:ring-indigo-400 text-xs"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-indigo-600"
                          aria-label={`Edit ${c.name}`}
                        >
                          <Icon.Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600"
                          aria-label={`Delete ${c.name}`}
                        >
                          <Icon.Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {editingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl border border-white/50 bg-white/80 p-6 shadow-xl animate-[fadeIn_.15s_ease-out]">
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/60" />
              <h3 className="text-lg font-semibold text-slate-900">Edit Customer</h3>

              <div className="mt-4 space-y-3">
                <label className="block text-sm">
                  <span className="text-slate-600">Name</span>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white/90 focus:ring-2 focus:ring-indigo-400"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-slate-600">Email</span>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white/90 focus:ring-2 focus:ring-indigo-400"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-slate-600">Phone</span>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white/90 focus:ring-2 focus:ring-indigo-400"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm">
                    <span className="text-slate-600">Status</span>
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white/90 focus:ring-2 focus:ring-indigo-400"
                      value={formData.status || STATUSES[0]}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm">
                    <span className="text-slate-600">Role</span>
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white/90 focus:ring-2 focus:ring-indigo-400"
                      value={formData.role || ROLES[0]}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block text-sm">
                  <span className="text-slate-600">Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white/90 focus:ring-2 focus:ring-indigo-400"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fData = new FormData();
                      fData.append("photo", file);
                      try {
                        const res = await fetch(`${API_BASE_URL}/upload`, { method: "POST", body: fData });
                        const data = await res.json();
                        setFormData({ ...formData, photo: data.url });
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                </label>

                {formData.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.photo} alt="preview" className="w-20 h-20 rounded-full border mt-1 object-cover" />
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow hover:opacity-95"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerTable;
