import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "../firebase";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function EditBanner() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  // Existing URLs (fallback support)
  const [desktopURL, setDesktopURL] = useState("");
  const [squareURL, setSquareURL] = useState("");
  const [tallURL, setTallURL] = useState("");

  // New image files
  const [desktopFile, setDesktopFile] = useState(null);
  const [squareFile, setSquareFile] = useState(null);
  const [tallFile, setTallFile] = useState(null);

  const [actionType, setActionType] = useState("none");
  const [actionValue, setActionValue] = useState("");
  const [order, setOrder] = useState(1);
  const [status, setStatus] = useState("active");

  // ------------------------------------------
  // Load Banner
  // ------------------------------------------
  async function loadBanner() {
    const snap = await getDoc(doc(db, "banners", id));

    if (!snap.exists()) {
      alert("Banner not found!");
      return;
    }

    const data = snap.data();

    // Backward compatible
    setDesktopURL(data.image_desktop || data.image || data.imageURL || "");
    setSquareURL(data.image_mobileSquare || "");
    setTallURL(data.image_mobileTall || "");

    setActionType(data.actionType || "none");
    setActionValue(data.actionValue || "");
    setOrder(data.order ?? 1);
    setStatus(data.status ?? "active");

    setLoading(false);
  }

  useEffect(() => {
    loadBanner();
  }, []);

  // ------------------------------------------
  // Upload helper
  // ------------------------------------------
  const uploadImage = async (file) => {
    const fileName = `banner_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `banners/${fileName}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // ------------------------------------------
  // Save Changes
  // ------------------------------------------
  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);

    let finalDesktop = desktopURL;
    let finalSquare = squareURL;
    let finalTall = tallURL;

    // Replace files if new ones selected
    if (desktopFile) finalDesktop = await uploadImage(desktopFile);
    if (squareFile) finalSquare = await uploadImage(squareFile);
    if (tallFile) finalTall = await uploadImage(tallFile);

    await updateDoc(doc(db, "banners", id), {
      image_desktop: finalDesktop,
      image_mobileSquare: finalSquare,
      image_mobileTall: finalTall,

      // backward support
      image: finalDesktop,
      imageURL: finalDesktop,

      actionType,
      actionValue,
      order: Number(order),
      status,
      updatedAt: new Date().toISOString(),
    });

    alert("Banner updated!");
    setLoading(false);
  }

  // ------------------------------------------
  // UI
  // ------------------------------------------
  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;

  return (
    <div style={{ maxWidth: 650, padding: 20 }}>
      <h2>Edit Banner</h2>

      <form onSubmit={handleUpdate}>
        {/* Desktop Banner */}
        <h3>Desktop Banner (1500×550)</h3>
        <img
          src={desktopURL}
          style={{
            width: "100%",
            height: 160,
            borderRadius: 12,
            objectFit: "cover",
            marginBottom: 10,
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setDesktopFile(e.target.files[0])}
        />

        {/* Square Banner */}
        <h3 style={{ marginTop: 20 }}>Mobile Square (1080×1080)</h3>
        {squareURL && (
          <img
            src={squareURL}
            style={{
              width: "50%",
              height: "auto",
              borderRadius: 12,
              marginBottom: 10,
            }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSquareFile(e.target.files[0])}
        />

        {/* Tall Banner */}
        <h3 style={{ marginTop: 20 }}>Mobile Tall (1080×1350)</h3>
        {tallURL && (
          <img
            src={tallURL}
            style={{
              width: "50%",
              height: "auto",
              borderRadius: 12,
              marginBottom: 10,
            }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setTallFile(e.target.files[0])}
        />

        {/* Action */}
        <label style={{ display: "block", marginTop: 20 }}>Action Type</label>
        <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
          <option value="none">No Action</option>
          <option value="category">Open Category</option>
          <option value="product">Open Product</option>
          <option value="external">External URL</option>
        </select>

        {actionType !== "none" && (
          <>
            <label style={{ display: "block", marginTop: 10 }}>Action Value</label>
            <input
              type="text"
              value={actionValue}
              onChange={(e) => setActionValue(e.target.value)}
              placeholder="Category Slug / Product ID / URL"
              style={{ width: "100%", padding: 8 }}
            />
          </>
        )}

        {/* Order */}
        <label style={{ display: "block", marginTop: 20 }}>Display Order</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={{ width: 100, padding: 8 }}
        />

        {/* Status */}
        <label style={{ display: "block", marginTop: 20 }}>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 30,
            padding: "10px 20px",
            background: "#111",
            color: "#fff",
            borderRadius: 8,
          }}
        >
          {loading ? "Updating…" : "Update Banner"}
        </button>
      </form>
    </div>
  );
}
