// src/pages/Banners.jsx
import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

export default function Banners() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "banners"), orderBy("order", "asc"));
    return onSnapshot(q, (snap) => {
      setBanners(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  /* Toggle active / inactive */
  const toggleStatus = async (banner) => {
    await updateDoc(doc(db, "banners", banner.id), {
      status: banner.status === "active" ? "inactive" : "active",
    });
  };

  /* Delete banner completely */
  const deleteBanner = async (banner) => {
    if (!window.confirm("Delete banner?")) return;

    // delete desktop
    if (banner.image_desktop) {
      await deleteObject(ref(storage, banner.image_desktop)).catch(() => {});
    }

    // delete mobile square
    if (banner.image_mobileSquare) {
      await deleteObject(ref(storage, banner.image_mobileSquare)).catch(() => {});
    }

    // delete mobile tall
    if (banner.image_mobileTall) {
      await deleteObject(ref(storage, banner.image_mobileTall)).catch(() => {});
    }

    // backward compatible deletes
    if (banner.imageURL) {
      await deleteObject(ref(storage, banner.imageURL)).catch(() => {});
    }

    if (banner.image) {
      await deleteObject(ref(storage, banner.image)).catch(() => {});
    }

    await deleteDoc(doc(db, "banners", banner.id));
  };

  /* Decide which preview to show (Desktop preferred) */
  const getPreviewImage = (b) => {
    return (
      b.image_desktop ||
      b.imageURL ||
      b.image ||
      ""
    );
  };

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h2>Banners</h2>
        <Link to="/add-banner" style={styles.addBtn}>+ Add Banner</Link>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Preview</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {banners.map((b) => (
            <tr key={b.id}>
              <td>{b.order}</td>

              <td>
                {getPreviewImage(b) ? (
                  <img
                    src={getPreviewImage(b)}
                    alt="banner"
                    style={{
                      width: 140,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 140,
                      height: 70,
                      background: "#ddd",
                      borderRadius: 6,
                    }}
                  />
                )}
              </td>

              <td>
                <button
                  onClick={() => toggleStatus(b)}
                  style={{
                    ...styles.statusBtn,
                    background: b.status === "active" ? "#0c7" : "#aaa",
                    color: "#fff",
                  }}
                >
                  {b.status === "active" ? "Active" : "Inactive"}
                </button>
              </td>

              <td>
                <Link to={`/edit-banner/${b.id}`} style={styles.editBtn}>
                  Edit
                </Link>

                <button
                  onClick={() => deleteBanner(b)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </AdminLayout>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  addBtn: {
    padding: "8px 14px",
    background: "#111",
    color: "#fff",
    borderRadius: 6,
    textDecoration: "none",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  statusBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    border: "none",
  },
  editBtn: {
    marginRight: 12,
    textDecoration: "none",
    background: "#0c7",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 6,
  },
  deleteBtn: {
    background: "#e00",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    border: "none",
  },
};
