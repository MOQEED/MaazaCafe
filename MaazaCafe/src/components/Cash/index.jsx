import { useState, useEffect } from "react";
import { printContent } from "../../utils/pdf";
import { getData, saveData } from "../../utils/storage";
import "./index.css";

export default function Cash() {
  // ✅ LOAD DATA SAFELY (NO REFRESH LOSS)
  const [data, setData] = useState(() => {
    return getData("cash") || [];
  });

  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");

  // ✅ SAVE DATA SAFELY
  useEffect(() => {
    saveData("cash", data);
  }, [data]);

  // ➕ ADD ITEM
  const addItem = () => {
    if (!item || !price || !qty) return;

    const today = new Date().toLocaleDateString();

    const newEntry = {
      id: Date.now(),
      item,
      price: Number(price),
      qty: Number(qty),
      total: Number(price) * Number(qty),
      date: today,
    };

    setData([...data, newEntry]);

    setItem("");
    setPrice("");
    setQty("");
  };

  // ❌ DELETE
  const deleteItem = (id) => {
    setData(data.filter((d) => d.id !== id));
  };

  // ✏️ EDIT
  const editItem = (entry) => {
    setItem(entry.item);
    setPrice(entry.price);
    setQty(entry.qty);
    deleteItem(entry.id);
  };

  // 📅 GROUP BY DATE
  const grouped = data.reduce((acc, curr) => {
    if (!curr.date) return acc;

    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);

    return acc;
  }, {});

  // 🔥 SORT LATEST FIRST
  const dates = Object.keys(grouped).sort((a, b) => {
    const [d1, m1, y1] = a.split("/");
    const [d2, m2, y2] = b.split("/");
    return new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1);
  });

  return (
    <div className="cash-container">
      <h2>💰 Cash / Expenses</h2>

      {/* FORM */}
      <div className="cash-form">
        <input
          placeholder="Item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <button onClick={addItem}>Add</button>
        
      </div>

      {/* DAY-WISE CARDS */}
      <div className="cash-cards">
        {dates.map((date, i) => {
          const items = grouped[date];
          const total = items.reduce((s, i) => s + i.total, 0);

          return (
            <div key={i} className="cash-card">
              <div className="card-header">
                <h3>📅 {date}</h3>
                <span className="day-total">₹{total}</span>
              </div>

              <button
                className="print-btn"
                onClick={() => {
                  let text = `Maaza Cafe\nDate: ${date}\n\n`;

                  items.forEach((i) => {
                    text += `${i.item} ${i.qty} x ₹${i.price} = ₹${i.total}\n`;
                  });

                  text += `\nTotal: ₹${total}`;
                  printContent(text);
                }}
              >
                🖨 Print Day Report
              </button>

              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td>{it.item}</td>
                      <td>{it.qty}</td>
                      <td>₹{it.price}</td>
                      <td>₹{it.total}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => editItem(it)}
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteItem(it.id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}