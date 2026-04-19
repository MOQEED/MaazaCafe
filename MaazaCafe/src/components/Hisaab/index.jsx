import { useState, useEffect, useMemo } from "react";
import "./index.css";

const STORAGE_KEY = "maazaHisaab";

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function newId() {
  return crypto.randomUUID ? crypto.randomUUID() : `h-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatDt(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function Hisaab() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState(() => loadEntries());
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => {
      const ta = new Date(a.createdAt || 0).getTime();
      const tb = new Date(b.createdAt || 0).getTime();
      return tb - ta;
    });
  }, [entries]);

  const resetForm = () => {
    setName("");
    setAmount("");
    setEditingId(null);
  };

  const addOrUpdate = () => {
    const n = name.trim();
    const amt = Number(amount);
    if (!n || Number.isNaN(amt)) return;

    const now = new Date().toISOString();

    if (editingId) {
      setEntries((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? { ...row, name: n, amount: amt, updatedAt: now }
            : row
        )
      );
      resetForm();
      return;
    }

    setEntries((prev) => [
      ...prev,
      {
        id: newId(),
        name: n,
        amount: amt,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    resetForm();
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setName(row.name);
    setAmount(String(row.amount));
  };

  const remove = (id) => {
    setEntries((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="hisaab-container">
      <h2>Hisaab</h2>
      <p className="hisaab-sub">Track entries with name, amount, and date &amp; time.</p>

      <div className="hisaab-form">
        <input
          placeholder="Name / description"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
        />
        <div className="hisaab-form-actions">
          <button type="button" className="hisaab-btn primary" onClick={addOrUpdate}>
            {editingId ? "Save changes" : "Add entry"}
          </button>
          {editingId && (
            <button type="button" className="hisaab-btn ghost" onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>
      </div>

      <table className="hisaab-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Created</th>
            <th>Last updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={5} className="hisaab-empty">
                No entries yet. Add one above.
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>₹{Number(row.amount).toLocaleString("en-IN")}</td>
                <td>{formatDt(row.createdAt)}</td>
                <td>{formatDt(row.updatedAt || row.createdAt)}</td>
                <td className="hisaab-actions">
                  <button type="button" className="hisaab-mini edit" onClick={() => startEdit(row)}>
                    Edit
                  </button>
                  <button type="button" className="hisaab-mini delete" onClick={() => remove(row.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
