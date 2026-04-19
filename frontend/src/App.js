import { useEffect, useState, useCallback } from "react";

const API = "http://127.0.0.1:5000/api";

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: type === "error" ? "#FF4757" : type === "warn" ? "#FFA502" : "#2ED573",
      color: "#fff", padding: "14px 22px", borderRadius: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: "'DM Sans', sans-serif",
      fontWeight: 600, fontSize: 15, maxWidth: 340, animation: "slideIn .3s ease"
    }}>{msg}</div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "22px 26px",
      boxShadow: "0 2px 16px rgba(10,37,64,.07)", flex: 1, minWidth: 160,
      borderLeft: `5px solid ${color}`
    }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#0A2540", fontFamily: "'Syne', sans-serif" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#666", fontWeight: 600, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: color, fontWeight: 700, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── SLOT CARD ────────────────────────────────────────────────────────────────
function SlotCard({ slot, onBook, isAdmin, onToggle, onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "#F8FAFF" : "#fff",
        border: slot.isAvailable ? "2px solid #E8F5E9" : "2px solid #FFEBEE",
        borderRadius: 16, padding: "20px 18px", width: 210,
        boxShadow: hover ? "0 8px 32px rgba(10,37,64,.12)" : "0 2px 12px rgba(10,37,64,.06)",
        transition: "all .2s ease", position: "relative"
      }}
    >
      <div style={{
        position: "absolute", top: 14, right: 14,
        background: slot.isAvailable ? "#E8F5E9" : "#FFEBEE",
        color: slot.isAvailable ? "#2E7D32" : "#C62828",
        fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20
      }}>
        {slot.isAvailable ? "FREE" : "TAKEN"}
      </div>

      <div style={{ fontSize: 32 }}>{slot.type === "bike" ? "🏍️" : "🚗"}</div>
      <div style={{ fontWeight: 800, fontSize: 17, color: "#0A2540", marginTop: 8, fontFamily: "'Syne', sans-serif" }}>
        {slot.slotNumber}
      </div>
      <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{slot.location}</div>
      <div style={{ fontSize: 13, color: "#888", marginTop: 2, textTransform: "capitalize" }}>{slot.type}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#0A2540", margin: "10px 0 14px", fontFamily: "'Syne', sans-serif" }}>
        ₹{slot.pricePerHour}<span style={{ fontSize: 12, fontWeight: 400, color: "#999" }}>/hr</span>
      </div>

      {!isAdmin && (
        <button
          disabled={!slot.isAvailable}
          onClick={() => onBook(slot._id)}
          style={{
            width: "100%", padding: "10px 0", border: "none", borderRadius: 10,
            background: slot.isAvailable ? "linear-gradient(135deg,#00C2FF,#0A2540)" : "#E0E0E0",
            color: slot.isAvailable ? "#fff" : "#999", fontWeight: 700,
            fontSize: 14, cursor: slot.isAvailable ? "pointer" : "not-allowed", transition: "all .2s"
          }}
        >
          {slot.isAvailable ? "Book Now" : "Unavailable"}
        </button>
      )}

      {isAdmin && (
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button onClick={() => onToggle(slot._id, slot.isAvailable)} style={{
            flex: 1, padding: "8px 0", border: "none", borderRadius: 8,
            background: slot.isAvailable ? "#FFF3E0" : "#E8F5E9",
            color: slot.isAvailable ? "#E65100" : "#2E7D32",
            fontWeight: 700, fontSize: 12, cursor: "pointer"
          }}>
            {slot.isAvailable ? "Disable" : "Enable"}
          </button>
          <button onClick={() => onDelete(slot._id)} style={{
            padding: "8px 12px", border: "none", borderRadius: 8,
            background: "#FFEBEE", color: "#C62828",
            fontWeight: 700, fontSize: 12, cursor: "pointer"
          }}>🗑</button>
        </div>
      )}
    </div>
  );
}

// ─── MINI BAR CHART ──────────────────────────────────────────────────────────
function BarChart({ data }) {
  if (!data || data.length === 0) return <div style={{ color: "#999", padding: 20 }}>No data yet</div>;
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%", background: "linear-gradient(180deg,#00C2FF,#0A2540)",
            borderRadius: "4px 4px 0 0", height: `${(d.count / max) * 60}px`,
            minHeight: 4, transition: "height .4s ease"
          }} title={`${d.count} bookings`} />
          <div style={{ fontSize: 9, color: "#999", whiteSpace: "nowrap" }}>{d._id?.slice(5)}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem("sp_token") || null; } catch { return null; }
  });
  const [user, setUser] = useState(() => {
    try { const u = localStorage.getItem("sp_user"); return u ? JSON.parse(u) : null; } catch { return null; }
  });
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState("slots");
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [bookModal, setBookModal] = useState(null); // slotId
  const [vehicleNum, setVehicleNum] = useState("");
  const [addSlotModal, setAddSlotModal] = useState(false);
  const [slotForm, setSlotForm] = useState({ location: "", slotNumber: "", type: "car", pricePerHour: "" });

  const notify = (msg, type = "success") => setToast({ msg, type });

  // ── FETCH ──
  const fetchSlots = useCallback(async () => {
    const res = await fetch(`${API}/slots`);
    setSlots(await res.json());
  }, []);

  const fetchBookings = useCallback(async () => {
    if (!token) return;
    const res = await fetch(`${API}/bookings`, { headers: getHeaders(token) });
    setBookings(await res.json());
  }, [token]);

  const fetchUsers = useCallback(async () => {
    if (!token || user?.role !== "admin") return;
    const res = await fetch(`${API}/auth/users`, { headers: getHeaders(token) });
    setUsers(await res.json());
  }, [token, user?.role]);

  const fetchAnalytics = useCallback(async () => {
    if (!token || user?.role !== "admin") return;
    const res = await fetch(`${API}/bookings/analytics`, { headers: getHeaders(token) });
    setAnalytics(await res.json());
  }, [token, user?.role]);

  useEffect(() => {
    fetchSlots();
    if (token) { fetchBookings(); fetchUsers(); fetchAnalytics(); }
  }, [token, fetchSlots, fetchBookings, fetchUsers, fetchAnalytics]);

  // ── AUTH ──
  const handleAuth = async () => {
    if (!form.email || !form.password) return notify("Fill in all fields", "warn");
    setLoading(true);
    try {
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const res = await fetch(`${API}/auth/${isRegister ? "register" : "login"}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setLoading(false);

      // DEBUG — remove after fix confirmed
      console.log("🔍 LOGIN RESPONSE:", JSON.stringify(data));

      if (!res.ok) {
        notify(data.message || "Login failed", "error");
        return;
      }

      // Support BOTH old backend (returns {message, user})
      // AND new backend (returns {message, token, user})
      const loggedInUser = data.user || null;

      if (!loggedInUser) {
        notify("Login error: no user returned from server", "error");
        return;
      }

      const authToken = data.token || "no-token-" + Date.now();

      localStorage.setItem("sp_token", authToken);
      localStorage.setItem("sp_user", JSON.stringify(loggedInUser));

      const newTab = loggedInUser.role === "admin" ? "dashboard" : "slots";
      setActiveTab(newTab);
      setToken(authToken);
      setUser({ ...loggedInUser });
      notify("Welcome, " + loggedInUser.name + "! 👋");
    } catch (err) {
      setLoading(false);
      notify("Cannot reach server. Is the backend running?", "error");
    }
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem("sp_token"); localStorage.removeItem("sp_user");
  };

  // ── BOOK ──
  const confirmBook = async () => {
    if (!vehicleNum.trim()) return notify("Enter vehicle number", "warn");
    const res = await fetch(`${API}/bookings`, {
      method: "POST", headers: getHeaders(token),
      body: JSON.stringify({
        slotId: bookModal,
        vehicleNumber: vehicleNum,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString()
      })
    });
    const data = await res.json();
    notify(data.message, res.ok ? "success" : "error");
    if (res.ok) { setBookModal(null); setVehicleNum(""); fetchSlots(); fetchBookings(); }
  };

  // ── SLOT ACTIONS ──
  const toggleSlot = async (id, current) => {
    // Optimistic update so UI responds instantly
    setSlots(prev => prev.map(s => s._id === id ? { ...s, isAvailable: !current } : s));
    try {
      const res = await fetch(`${API}/slots/${id}`, {
        method: "PUT", headers: getHeaders(token),
        body: JSON.stringify({ isAvailable: !current })
      });
      if (!res.ok) {
        setSlots(prev => prev.map(s => s._id === id ? { ...s, isAvailable: current } : s));
        notify("Update failed — check backend", "error");
      } else {
        notify(!current ? "Slot enabled ✅" : "Slot disabled ✅");
        fetchSlots();
      }
    } catch {
      setSlots(prev => prev.map(s => s._id === id ? { ...s, isAvailable: current } : s));
      notify("Server error", "error");
    }
  };

  const deleteSlot = async (id) => {
    if (!window.confirm("Delete this slot?")) return;
    setSlots(prev => prev.filter(s => s._id !== id));
    try {
      const res = await fetch(`${API}/slots/${id}`, { method: "DELETE", headers: getHeaders(token) });
      if (!res.ok) { notify("Delete failed — check backend", "error"); fetchSlots(); }
      else notify("Slot deleted ✅");
    } catch {
      notify("Server error", "error"); fetchSlots();
    }
  };

  const addSlot = async () => {
    if (!slotForm.location || !slotForm.slotNumber || !slotForm.pricePerHour)
      return notify("Fill all fields", "warn");
    const res = await fetch(`${API}/slots/add`, {
      method: "POST", headers: getHeaders(token),
      body: JSON.stringify({ ...slotForm, pricePerHour: Number(slotForm.pricePerHour) })
    });
    const data = await res.json();
    notify(data.message, res.ok ? "success" : "error");
    if (res.ok) { setAddSlotModal(false); setSlotForm({ location: "", slotNumber: "", type: "car", pricePerHour: "" }); fetchSlots(); }
  };

  // ── BOOKING ACTIONS ──
  const updateBookingStatus = async (id, status) => {
    await fetch(`${API}/bookings/${id}`, {
      method: "PUT", headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    notify(`Marked as ${status}`); fetchBookings(); fetchSlots();
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete booking?")) return;
    await fetch(`${API}/bookings/${id}`, { method: "DELETE", headers: getHeaders(token) });
    notify("Booking deleted"); fetchBookings(); fetchSlots();
  };

  // ── USER ACTIONS ──
  const updateRole = async (id, role) => {
    // Optimistic update
    setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));
    try {
      const res = await fetch(`${API}/auth/users/${id}/role`, {
        method: "PUT", headers: getHeaders(token),
        body: JSON.stringify({ role })
      });
      if (!res.ok) {
        notify("Role update failed — check backend", "error");
        fetchUsers(); // revert
      } else {
        notify(`Role changed to ${role} ✅`);
        fetchUsers();
      }
    } catch {
      notify("Server error", "error"); fetchUsers();
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    setUsers(prev => prev.filter(u => u._id !== id));
    try {
      const res = await fetch(`${API}/auth/users/${id}`, { method: "DELETE", headers: getHeaders(token) });
      if (!res.ok) { notify("Delete failed — check backend", "error"); fetchUsers(); }
      else notify("User deleted ✅");
    } catch {
      notify("Server error", "error"); fetchUsers();
    }
  };

  const filteredSlots = slots.filter(s => filter === "all" || (s.type || "").trim().toLowerCase() === filter.toLowerCase());

  // ─── AUTH PAGE ─────────────────────────────────────────────────────────────
  if (!user) return (
    <div style={S.authBg}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`@keyframes slideIn{from{transform:translateX(60px);opacity:0}to{transform:none;opacity:1}}`}</style>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div style={S.authCard}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 44 }}>🅿️</div>
          <h1 style={S.authTitle}>Smart Parking</h1>
          <p style={{ color: "#888", fontSize: 14 }}>{isRegister ? "Create your account" : "Sign in to continue"}</p>
        </div>

        {isRegister && <input placeholder="Full Name" style={S.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />}
        <input placeholder="Email" style={S.input} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" style={S.input} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        {isRegister && (
          <select style={S.input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}

        <button style={S.primaryBtn} onClick={handleAuth} disabled={loading}>
          {loading ? "Please wait…" : isRegister ? "Create Account" : "Sign In"}
        </button>
        <p style={{ textAlign: "center", color: "#00C2FF", cursor: "pointer", marginTop: 16, fontSize: 14, fontWeight: 600 }}
          onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Sign in" : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );

  // ─── MAIN DASHBOARD ────────────────────────────────────────────────────────
  const isAdmin = user.role === "admin";
  const adminTabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "slots", label: "🅿️ Slots" },
    { id: "bookings", label: "📋 Bookings" },
    { id: "users", label: "👥 Users" },
  ];
  const userTabs = [
    { id: "slots", label: "🅿️ Find Parking" },
    { id: "bookings", label: "📋 My Bookings" },
  ];
  const tabs = isAdmin ? adminTabs : userTabs;

  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideIn{from{transform:translateX(60px);opacity:0}to{transform:none;opacity:1}}
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
      `}</style>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* SIDEBAR */}
      <div style={S.sidebar}>
        <div style={{ padding: "28px 20px 20px" }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🅿️</div>
          <div style={S.sideTitle}>Smart<br />Parking</div>
        </div>
        <nav style={{ flex: 1 }}>
          {tabs.map(t => (
            <div key={t.id} onClick={() => setActiveTab(t.id)} style={{
              ...S.navItem, ...(activeTab === t.id ? S.navActive : {})
            }}>{t.label}</div>
          ))}
        </nav>
        <div style={{ padding: "16px 20px 28px" }}>
          <div style={{ fontSize: 13, color: "#ccc", marginBottom: 4 }}>{user.name}</div>
          <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>{user.role}</div>
          <button style={S.logoutBtn} onClick={logout}>Sign Out</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={S.main}>
        <div style={S.header}>
          <div>
            <h1 style={S.pageTitle}>
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "slots" && (isAdmin ? "Slot Management" : "Find Parking")}
              {activeTab === "bookings" && (isAdmin ? "Booking Management" : "My Bookings")}
              {activeTab === "users" && "User Management"}
            </h1>
            <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
              Welcome back, {user.name} 👋
            </div>
          </div>
          {activeTab === "slots" && isAdmin && (
            <button style={S.primaryBtn} onClick={() => setAddSlotModal(true)}>+ Add Slot</button>
          )}
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && analytics && (
          <div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
              <StatCard icon="📋" label="Total Bookings" value={analytics.total} color="#00C2FF" />
              <StatCard icon="✅" label="Active" value={analytics.active} color="#2ED573" />
              <StatCard icon="🏁" label="Completed" value={analytics.completed} color="#7B68EE" />
              <StatCard icon="❌" label="Cancelled" value={analytics.cancelled} color="#FF4757" />
              <StatCard icon="💰" label="Total Revenue" value={`₹${analytics.totalRevenue?.toFixed(0)}`} color="#FFA502" />
              <StatCard icon="🅿️" label="Total Slots" value={slots.length} color="#0A2540"
                sub={`${slots.filter(s => s.isAvailable).length} available`} />
            </div>
            <div style={S.card}>
              <h3 style={S.sectionTitle}>Bookings — Last 7 Days</h3>
              <BarChart data={analytics.daily} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ ...S.card, flex: 1, minWidth: 200 }}>
                <h3 style={S.sectionTitle}>Slots Overview</h3>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <div style={{ flex: slots.filter(s => s.isAvailable).length, background: "#2ED573", height: 12, borderRadius: 6 }} />
                  <div style={{ flex: slots.filter(s => !s.isAvailable).length || 1, background: "#FF4757", height: 12, borderRadius: 6 }} />
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: "#666" }}>
                  <span>🟢 Available: {slots.filter(s => s.isAvailable).length}</span>
                  <span>🔴 Occupied: {slots.filter(s => !s.isAvailable).length}</span>
                </div>
              </div>
              <div style={{ ...S.card, flex: 1, minWidth: 200 }}>
                <h3 style={S.sectionTitle}>User Stats</h3>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#0A2540", fontFamily: "'Syne',sans-serif" }}>{users.length}</div>
                <div style={{ fontSize: 13, color: "#666" }}>Total users registered</div>
                <div style={{ fontSize: 12, color: "#00C2FF", marginTop: 4 }}>
                  {users.filter(u => u.role === "admin").length} admins · {users.filter(u => u.role === "user").length} users
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SLOTS TAB ── */}
        {activeTab === "slots" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
              {["all", "car", "bike"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  ...S.filterBtn, ...(filter === f ? S.filterActive : {})
                }}>
                  {f === "all" ? "All" : f === "car" ? "🚗 Car" : "🏍️ Bike"}
                </button>
              ))}
              <div style={{ marginLeft: "auto", fontSize: 13, color: "#888", alignSelf: "center" }}>
                {filteredSlots.filter(s => s.isAvailable).length} available of {filteredSlots.length}
              </div>
            </div>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              {filteredSlots.length === 0 && <div style={{ color: "#999", padding: 20 }}>No slots found.</div>}
              {filteredSlots.map(s => (
                <SlotCard key={s._id} slot={s} isAdmin={isAdmin}
                  onBook={(id) => { setBookModal(id); setVehicleNum(""); }}
                  onToggle={toggleSlot} onDelete={deleteSlot} />
              ))}
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTab === "bookings" && (
          <div style={S.card}>
            {bookings.length === 0 && <div style={{ color: "#999", padding: 16 }}>No bookings found.</div>}
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr style={{ background: "#F8FAFF" }}>
                    {isAdmin && <th style={S.th}>User</th>}
                    <th style={S.th}>Slot</th>
                    <th style={S.th}>Vehicle</th>
                    <th style={S.th}>Start</th>
                    <th style={S.th}>End</th>
                    <th style={S.th}>Amount</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                      {isAdmin && <td style={S.td}>{b.userName || "—"}</td>}
                      <td style={S.td}>{b.slotId?.slotNumber || b.slotId || "—"}</td>
                      <td style={S.td}>{b.vehicleNumber || "—"}</td>
                      <td style={S.td}>{new Date(b.startTime).toLocaleString()}</td>
                      <td style={S.td}>{new Date(b.endTime).toLocaleString()}</td>
                      <td style={S.td}>₹{b.totalAmount?.toFixed(0) || 0}</td>
                      <td style={S.td}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: b.status === "active" ? "#E8F5E9" : b.status === "completed" ? "#E3F2FD" : "#FFEBEE",
                          color: b.status === "active" ? "#2E7D32" : b.status === "completed" ? "#1565C0" : "#C62828"
                        }}>{b.status}</span>
                      </td>
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {isAdmin && b.status === "active" && (
                            <button onClick={() => updateBookingStatus(b._id, "completed")} style={S.actionBtn("#E3F2FD", "#1565C0")}>Complete</button>
                          )}
                          {b.status === "active" && (
                            <button onClick={() => updateBookingStatus(b._id, "cancelled")} style={S.actionBtn("#FFEBEE", "#C62828")}>Cancel</button>
                          )}
                          {isAdmin && (
                            <button onClick={() => deleteBooking(b._id)} style={S.actionBtn("#FFEBEE", "#C62828")}>🗑</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === "users" && isAdmin && (
          <div style={S.card}>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr style={{ background: "#F8FAFF" }}>
                    <th style={S.th}>Name</th>
                    <th style={S.th}>Email</th>
                    <th style={S.th}>Role</th>
                    <th style={S.th}>Joined</th>
                    <th style={S.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                      <td style={S.td}>{u.name}</td>
                      <td style={S.td}>{u.email}</td>
                      <td style={S.td}>
                        <select value={u.role} onChange={e => updateRole(u._id, e.target.value)}
                          style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid #ddd", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={S.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={S.td}>
                        <button onClick={() => deleteUser(u._id)} style={S.actionBtn("#FFEBEE", "#C62828")}>🗑 Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── BOOK MODAL ── */}
      {bookModal && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h3 style={S.sectionTitle}>Confirm Booking</h3>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 16 }}>1 hour slot — starts now</p>
            <input placeholder="Vehicle Number (e.g. RJ14AB1234)" style={S.input}
              value={vehicleNum} onChange={e => setVehicleNum(e.target.value)} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button style={{ ...S.primaryBtn, flex: 1 }} onClick={confirmBook}>Confirm Booking</button>
              <button style={{ ...S.primaryBtn, flex: 1, background: "#eee", color: "#333" }} onClick={() => setBookModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD SLOT MODAL ── */}
      {addSlotModal && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h3 style={S.sectionTitle}>Add New Slot</h3>
            <input placeholder="Location (e.g. Block A)" style={S.input}
              value={slotForm.location} onChange={e => setSlotForm({ ...slotForm, location: e.target.value })} />
            <input placeholder="Slot Number (e.g. A-01)" style={S.input}
              value={slotForm.slotNumber} onChange={e => setSlotForm({ ...slotForm, slotNumber: e.target.value })} />
            <select style={S.input} value={slotForm.type} onChange={e => setSlotForm({ ...slotForm, type: e.target.value })}>
              <option value="car">🚗 Car</option>
              <option value="bike">🏍️ Bike</option>
            </select>
            <input placeholder="Price per Hour (₹)" type="number" style={S.input}
              value={slotForm.pricePerHour} onChange={e => setSlotForm({ ...slotForm, pricePerHour: e.target.value })} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button style={{ ...S.primaryBtn, flex: 1 }} onClick={addSlot}>Add Slot</button>
              <button style={{ ...S.primaryBtn, flex: 1, background: "#eee", color: "#333" }} onClick={() => setAddSlotModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#F5F7FA" },
  authBg: { minHeight: "100vh", background: "linear-gradient(135deg,#0A2540 0%,#1a3a5c 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" },
  authCard: { background: "#fff", borderRadius: 20, padding: "40px 36px", width: 360, boxShadow: "0 20px 60px rgba(0,0,0,.2)" },
  authTitle: { fontFamily: "'Syne',sans-serif", fontSize: 28, color: "#0A2540", margin: "8px 0 4px", fontWeight: 800 },
  sidebar: { width: 220, background: "#0A2540", display: "flex", flexDirection: "column", minHeight: "100vh", position: "sticky", top: 0 },
  sideTitle: { fontFamily: "'Syne',sans-serif", color: "#fff", fontSize: 20, fontWeight: 800, lineHeight: 1.2 },
  navItem: { padding: "13px 20px", color: "#8899AA", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .2s", borderLeft: "3px solid transparent" },
  navActive: { color: "#fff", background: "rgba(0,194,255,.12)", borderLeft: "3px solid #00C2FF" },
  main: { flex: 1, padding: "32px 36px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  pageTitle: { fontFamily: "'Syne',sans-serif", fontSize: 26, color: "#0A2540", margin: 0, fontWeight: 800 },
  card: { background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 16px rgba(10,37,64,.07)" },
  sectionTitle: { fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: "#0A2540", margin: "0 0 12px" },
  input: { width: "100%", padding: "12px 14px", border: "1.5px solid #E8ECF0", borderRadius: 10, fontSize: 14, marginBottom: 12, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#FAFBFC" },
  primaryBtn: { padding: "12px 24px", background: "linear-gradient(135deg,#00C2FF,#0A2540)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  filterBtn: { padding: "8px 18px", border: "1.5px solid #E8ECF0", borderRadius: 20, background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#666" },
  filterActive: { background: "#0A2540", color: "#fff", borderColor: "#0A2540" },
  logoutBtn: { width: "100%", padding: "10px", background: "rgba(255,71,87,.15)", color: "#FF4757", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, background: "rgba(10,37,64,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: 20, padding: "32px", width: 380, boxShadow: "0 20px 60px rgba(0,0,0,.2)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "'DM Sans',sans-serif" },
  th: { padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#666", fontSize: 12, textTransform: "uppercase", letterSpacing: .5 },
  td: { padding: "12px 14px", color: "#333", verticalAlign: "middle" },
  actionBtn: (bg, color) => ({ padding: "5px 12px", border: "none", borderRadius: 8, background: bg, color, fontWeight: 700, fontSize: 12, cursor: "pointer" })
};