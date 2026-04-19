import { useState } from "react";
import './index.css'

export default function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("menu")) || []
  );

  const [userid, setUserid] = useState(localStorage.getItem("adminUser") || "");
  const [password, setPassword] = useState(localStorage.getItem("adminPass") || "");
  const [ownerUserid, setOwnerUserid] = useState(localStorage.getItem("ownerUser") || "");
  const [ownerPassword, setOwnerPassword] = useState(localStorage.getItem("ownerPass") || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    if (!name || !price) return;

    const newItem = { 
      name, 
      price: Number(price), 
      qty: 0,
      image: image || null
    };

    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("menu", JSON.stringify(updated));

    // ✅ RESET FORM
    setName("");
    setPrice("");
    setImage("");
    setImagePreview("");
    // Reset file input
    const fileInput = document.getElementById("imageInput");
    if (fileInput) fileInput.value = "";
  };

  const deleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    localStorage.setItem("menu", JSON.stringify(updated));
  };

  // ✅ EDIT FUNCTION
  const editItem = (index) => {
    const newName = prompt("Enter new name", items[index].name);
    const newPrice = prompt("Enter new price", items[index].price);

    if (!newName || !newPrice) return;

    const updated = [...items];
    updated[index] = { 
      ...updated[index], 
      name: newName, 
      price: Number(newPrice) 
    };

    setItems(updated);
    localStorage.setItem("menu", JSON.stringify(updated));
  };

  const saveCredentials = () => {
    if (!userid || !password) return alert("Please enter both userid and password");
    localStorage.setItem("adminUser", userid);
    localStorage.setItem("adminPass", password);
    alert("Main login credentials saved successfully");
  };

  const saveOwnerCredentials = () => {
    if (!ownerUserid || !ownerPassword) {
      return alert("Please enter both owner user ID and password");
    }
    localStorage.setItem("ownerUser", ownerUserid);
    localStorage.setItem("ownerPass", ownerPassword);
    localStorage.removeItem("ownerAuth");
    alert("Owner credentials saved. Owner will need to unlock again on Admin, Reports, or Hisaab.");
  };

  return (
    <div className="admin-container">
      <h2>Admin Page</h2>

      <div className="credentials-section">
        <h3>Main app login (Menu / Cash)</h3>
        <p className="credentials-note">Used on the home login screen to access the app.</p>
        <input 
          placeholder="User ID" 
          value={userid} 
          onChange={(e) => setUserid(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button onClick={saveCredentials} className="save-credentials-btn">Save main login</button>
      </div>

      <div className="credentials-section owner-credentials">
        <h3>Owner&apos;s login (Admin, Reports, Hisaab)</h3>
        <p className="credentials-note">Separate from main login. Unlock required after app logout or when the owner password changes.</p>
        <input 
          placeholder="Owner user ID" 
          value={ownerUserid} 
          onChange={(e) => setOwnerUserid(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Owner password" 
          value={ownerPassword} 
          onChange={(e) => setOwnerPassword(e.target.value)} 
        />
        <button onClick={saveOwnerCredentials} className="save-credentials-btn owner-save">Save owner login</button>
      </div>

      <div className="form-section">
        <input placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" />
        
        <div className="image-upload-section">
          <label htmlFor="imageInput" className="image-label">
            Upload Item Image
          </label>
          <input 
            id="imageInput"
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            className="file-input"
          />
          
          {imagePreview && (
            <div className="image-preview-container">
              <p className="preview-text">Image Preview:</p>
              <img src={imagePreview} alt="preview" className="image-preview" />
            </div>
          )}
        </div>

        <button onClick={addItem} className="add-btn">Add Item</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td>{it.name}</td>
              <td>₹{it.price}</td>
              <td>
                {it.image ? (
                  <img src={it.image} alt={it.name} className="table-image-thumb" />
                ) : (
                  <span className="no-image">No image</span>
                )}
              </td>
              <td>
                <button className="action-btn edit-btn" onClick={() => editItem(i)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => deleteItem(i)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}