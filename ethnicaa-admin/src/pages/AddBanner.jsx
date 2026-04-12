import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { db, storage } from "../firebase";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

export default function AddBanner() {
  const navigate = useNavigate();

  // Three images
  const [desktopFile, setDesktopFile] = useState(null);
  const [squareFile, setSquareFile] = useState(null);
  const [tallFile, setTallFile] = useState(null);

  // Uploaded URLs
  const [desktopURL, setDesktopURL] = useState("");
  const [squareURL, setSquareURL] = useState("");
  const [tallURL, setTallURL] = useState("");

  const [order, setOrder] = useState(1);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("active");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // -----------------------------
  // Upload Function (Reusable)
  // -----------------------------
  const uploadImage = async (file) => {
    const fileName = `banner_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `banners/${fileName}`);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // -----------------------------
  // Upload all 3 images
  // -----------------------------
  const handleUploadAll = async () => {
    if (!desktopFile || !squareFile || !tallFile) {
      alert("Upload all 3 images (Desktop, Square, Tall)");
      return;
    }

    try {
      setUploading(true);

      const dURL = await uploadImage(desktopFile);
      const sURL = await uploadImage(squareFile);
      const tURL = await uploadImage(tallFile);

      setDesktopURL(dURL);
      setSquareURL(sURL);
      setTallURL(tURL);

      alert("All images uploaded!");
    } catch (err) {
      console.error(err);
      alert("Error uploading images");
    } finally {
      setUploading(false);
    }
  };

  // -----------------------------
  // Save to Firestore
  // -----------------------------
  const handleSave = async () => {
    if (!desktopURL || !squareURL || !tallURL) {
      alert("Upload all images first!");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "banners"), {
        image_desktop: desktopURL,
        image_mobileSquare: squareURL,
        image_mobileTall: tallURL,

        // backward compatibility fields (optional)
        image: desktopURL,
        imageURL: desktopURL,

        link: link || "",
        order: Number(order),
        status,
        createdAt: Timestamp.now(),
      });

      alert("Banner added successfully!");
      navigate("/banners");
    } catch (err) {
      console.error(err);
      alert("Error saving banner");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div style={{ padding: 20, color: "#fff" }}>
      <h2>Add Banner</h2>

      <h3>Upload 3 Banner Sizes</h3>

      <div style={{ marginBottom: 20 }}>
        <p><b>Desktop (1500×550)</b></p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setDesktopFile(e.target.files[0])}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <p><b>Mobile Square (1080×1080)</b></p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSquareFile(e.target.files[0])}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <p><b>Mobile Tall (1080×1350)</b></p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setTallFile(e.target.files[0])}
        />
      </div>

      <button
        disabled={uploading}
        onClick={handleUploadAll}
        style={{ padding: "8px 16px" }}
      >
        {uploading ? "Uploading..." : "Upload All Images"}
      </button>

      {/* Previews */}
      {desktopURL && (
        <div style={{ marginTop: 20 }}>
          <h4>Desktop Preview</h4>
          <img src={desktopURL} style={{ width: 250, borderRadius: 10 }} />
        </div>
      )}

      {squareURL && (
        <div style={{ marginTop: 20 }}>
          <h4>Mobile Square Preview</h4>
          <img src={squareURL} style={{ width: 250, borderRadius: 10 }} />
        </div>
      )}

      {tallURL && (
        <div style={{ marginTop: 20 }}>
          <h4>Mobile Tall Preview</h4>
          <img src={tallURL} style={{ width: 250, borderRadius: 10 }} />
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Optional link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          type="number"
          min="1"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={{ padding: 8, width: 120 }}
        />
      </div>

      <button
        disabled={saving}
        onClick={handleSave}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#111",
          color: "#fff",
          borderRadius: 8,
        }}
      >
        {saving ? "Saving..." : "Save Banner"}
      </button>
    </div>
  );
}
