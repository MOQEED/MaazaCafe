import { useEffect, useState } from "react";
import { printContent } from "../../utils/pdf";
import { getData } from "../../utils/storage";
import * as XLSX from "xlsx";
import "./index.css";

export default function Reports() {
  const [bills, setBills] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    setBills(getData("bills") || []);
  }, []);

  // 📅 GROUP BY DATE
  const grouped = bills.reduce((acc, bill) => {
    const date = bill.date.split(",")[0];

    if (!acc[date]) acc[date] = [];
    acc[date].push(bill);

    return acc;
  }, {});

  // 📌 FILTER AND SORT DATES - REVERSE CHRONOLOGICAL ORDER
  let dates = Object.keys(grouped);
  
  // Parse date and sort in reverse order (newest first)
  dates = dates.sort((a, b) => {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day);
    };
    return parseDate(b) - parseDate(a);
  });

  // Apply date filter if user provides a date
  if (selectedDate) {
    dates = dates.filter((d) => d.toLowerCase().includes(selectedDate.toLowerCase()));
  }

  // 📊 MONTHLY TOTAL
  const monthlyTotal = bills.reduce((sum, b) => sum + b.total, 0);

  // 📥 EXCEL DOWNLOAD
  const downloadExcel = () => {
    const rows = [];

    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        rows.push({
          Date: bill.date,
          Item: item.name,
          Quantity: item.qty,
          Price: item.price,
          Total: item.qty * item.price,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    XLSX.writeFile(workbook, "Reports.xlsx");
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>📊 Sales Reports</h1>
        <p className="header-subtitle">Track your cafe sales and revenue</p>
      </div>

      <div className="report-controls">
        <div className="search-section">
          <label htmlFor="dateSearch">Search by Date:</label>
          <input
            id="dateSearch"
            type="text"
            placeholder="e.g., 17/3/2026 or 17/3"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <p className="card-label">Monthly Revenue</p>
              <p className="card-value">₹{monthlyTotal}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">📦</div>
            <div className="card-content">
              <p className="card-label">Total Bills</p>
              <p className="card-value">{bills.length}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">📅</div>
            <div className="card-content">
              <p className="card-label">Total Days</p>
              <p className="card-value">{dates.length}</p>
            </div>
          </div>
        </div>

        <button onClick={downloadExcel} className="download-btn">
          📥 Download Excel
        </button>
      </div>

      <div className="reports-list">
        {dates.length === 0 ? (
          <div className="no-data">
            <p>No reports found for the selected date.</p>
          </div>
        ) : (
          dates.map((date, i) => {
            const dayBills = grouped[date];

            const itemMap = {};

            dayBills.forEach((bill) => {
              bill.items.forEach((item) => {
                if (!itemMap[item.name]) {
                  itemMap[item.name] = {
                    qty: 0,
                    price: item.price,
                    total: 0,
                  };
                }

                itemMap[item.name].qty += item.qty;
                itemMap[item.name].total += item.qty * item.price;
              });
            });

            const itemsArray = Object.entries(itemMap);
            const dayTotal = itemsArray.reduce((s, [, v]) => s + v.total, 0);

            // 🖨 PRINT
            const handlePrint = () => {
              let text = `Maaza Cafe - Daily Report\nDate: ${date}\n\n`;

              itemsArray.forEach(([name, val]) => {
                text += `${name} ${val.qty} x ₹${val.price} = ₹${val.total}\n`;
              });

              text += `\nTotal: ₹${dayTotal}`;

              printContent(text);
            };

            return (
              <div key={i} className="day-box">
                <div className="day-header">
                  <div className="day-date">
                    <h3>📅 {date}</h3>
                    <span className="bill-count">{dayBills.length} bills</span>
                  </div>
                  <div className="day-total">
                    <p className="total-label">Day Total</p>
                    <p className="total-amount">₹{dayTotal}</p>
                  </div>
                </div>

                <div className="day-actions">
                  <button onClick={handlePrint} className="print-btn">
                    🖨 Print Report
                  </button>
                </div>

                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {itemsArray.map(([name, val], idx) => (
                      <tr key={idx}>
                        <td className="item-name">{name}</td>
                        <td className="item-qty">{val.qty}</td>
                        <td className="item-price">₹{val.price}</td>
                        <td className="item-total">₹{val.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
