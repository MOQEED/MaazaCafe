import { useState, useEffect } from "react";
import { printContent } from "../../utils/pdf";
import { getData, saveData } from "../../utils/storage";
import "./index.css";

const UNSPLASH_API_KEY = "YOUR_UNSPLASH_API_KEY"; // Get free key from unsplash.com/developers

export default function Menu() {
  const [items, setItems] = useState(getData("menu"));
  const [billNo, setBillNo] = useState(getData("billNo") || 1);
  const [itemImages, setItemImages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch images from Unsplash only if item doesn't have an image
  useEffect(() => {
    const fetchImages = async () => {
      const newImages = { ...itemImages };
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.image && !newImages[i]) {
          // Try to fetch from Unsplash as fallback
          try {
            const imageUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(item.name)}`;
            newImages[i] = imageUrl;
          } catch {
            // Fallback to a placeholder if fetch fails
            newImages[i] = null;
          }
        }
      }
      
      setItemImages(newImages);
    };

    fetchImages();
  }, [items]);

  useEffect(() => {
    saveData("menu", items);
  }, [items]);

  const update = (i, v) => {
    const arr = [...items];
    arr[i].qty = Math.max(0, arr[i].qty + v);
    setItems(arr);
  };

  const selected = items.filter((i) => i.qty > 0);
  const total = selected.reduce((s, i) => s + i.qty * i.price, 0);

  const filteredItems = items.filter((item, index) => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (index + 1).toString().includes(searchTerm)
  );

  const saveBill = () => {
    const bills = getData("bills") || [];

    bills.push({
      billNo,
      items: selected,
      total,
      date: new Date().toLocaleString(),
    });

    saveData("bills", bills);
    saveData("billNo", billNo + 1);
  };

  const reset = () => {
    setItems(items.map((i) => ({ ...i, qty: 0 })));
    setBillNo(getData("billNo") || 1);
  };

  // 🖨 PRINT ONLY (NO PDF)
  const handlePrint = () => {
    if (selected.length === 0) return;

    saveBill();

    let text = `Maaza Cafe\nBill No: ${billNo}\nDate: ${new Date().toLocaleString()}\n\n`;

    selected.forEach((i) => {
      text += `${i.name}  ${i.qty} x ₹${i.price} = ₹${i.qty * i.price}\n`;
    });

    text += `\nTotal: ₹${total}`;

    printContent(text);

    reset(); // refresh for next customer
  };

  const getBackgroundImage = (index, item) => {
    if (item.image) {
      return item.image;
    }
    return itemImages[index] || null;
  };

  return (
    <div className="menu-container">
      <h2>🍽 Maaza Cafe Menu</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by item name or serial number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="menu-content">
        <div className="menu-list">
        {filteredItems.map((it) => {
          const originalIndex = items.findIndex(item => item === it);
          const backgroundImage = getBackgroundImage(originalIndex, it);
          return (
            <div 
              key={originalIndex} 
              className="menu-card"
              style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
            >
              <div className="card-overlay">
                <span className="serial-number">#{originalIndex + 1}</span>
                <h4>{it.name}</h4>
                <p>₹{it.price}</p>

                <div className="qty-box">
                  <button onClick={() => update(originalIndex, -1)}>-</button>
                  <span>{it.qty}</span>
                  <button onClick={() => update(originalIndex, 1)}>+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bill-box">
          <div className="bill-corner-tl"></div>
          <div className="bill-corner-tr"></div>
          <div className="bill-corner-bl"></div>
          <div className="bill-corner-br"></div>
          
          <h3>🧾 Bill</h3>

          {selected.length === 0 && <p>No items selected</p>}

          {selected.map((i, idx) => (
            <div key={idx} className="bill-row">
              <span>{i.name}</span>
              <span>{i.qty} x ₹{i.price}</span>
              <span>₹{i.qty * i.price}</span>
            </div>
          ))}

          <hr />
          <h3>Total: ₹{total}</h3>

          {/* ✅ ONLY PRINT BUTTON */}
          <button className="download-btn" onClick={handlePrint}>
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
}
