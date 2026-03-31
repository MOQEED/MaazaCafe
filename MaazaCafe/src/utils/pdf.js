import jsPDF from "jspdf";

// 🧾 MENU BILL PDF
export const downloadPDF = (items, total, billNo) => {
  const doc = new jsPDF();

  doc.text("Maaza Cafe", 80, 10);
  doc.text(`Bill No: ${billNo}`, 10, 20);
  doc.text(`Date: ${new Date().toLocaleString()}`, 10, 30);

  let y = 45;

  items.forEach((i) => {
    doc.text(`${i.name} ${i.qty} x ${i.price} = ${i.qty * i.price}`, 10, y);
    y += 10;
  });

  doc.text(`Total: ₹${total}`, 10, y + 10);

  doc.save(`bill_${billNo}.pdf`);
};

// 💰 CASH PDF
export const downloadCashPDF = (data, total) => {
  const doc = new jsPDF();

  doc.text("Maaza Cafe - Expenses", 60, 10);

  let y = 30;

  data.forEach((d) => {
    doc.text(`${d.item} ${d.qty} x ${d.price} = ${d.total}`, 10, y);
    y += 10;
  });

  doc.text(`Total: ₹${total}`, 10, y + 10);

  doc.save("cash.pdf");
};

// 📊 REPORT PDF
export const downloadDailyPDF = (dayBills, date) => {
  const doc = new jsPDF();

  doc.text("Maaza Cafe - Daily Report", 40, 10);
  doc.text(`Date: ${date}`, 10, 20);

  let y = 35;

  const map = {};

  dayBills.forEach((b) => {
    b.items.forEach((i) => {
      if (!map[i.name]) map[i.name] = { qty: 0, price: i.price, total: 0 };

      map[i.name].qty += i.qty;
      map[i.name].total += i.qty * i.price;
    });
  });

  let total = 0;

  Object.entries(map).forEach(([name, val]) => {
    doc.text(`${name} ${val.qty} x ${val.price} = ${val.total}`, 10, y);
    y += 10;
    total += val.total;
  });

  doc.text(`Total: ₹${total}`, 10, y + 10);

  doc.save(`report_${date}.pdf`);
};

// 🖨 PRINT
export const printContent = (text) => {
  const win = window.open("", "", "width=800,height=600");
  win.document.write(`<pre>${text}</pre>`);
  win.print();
};