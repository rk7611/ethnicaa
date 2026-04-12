import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export default function ManageBanners() {
  const [banners, setBanners] = useState([]);

  /* Load banners */
  async function loadBanners() {
    const snap = await getDocs(
      query(collection(db, "banners"), orderBy("order", "asc"))
    );

    setBanners(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  }

  useEffect(() => {
    loadBanners();
  }, []);

  /* Toggle active/inactive */
  async function toggleStatus(banner) {
    const newStatus = banner.status === "active" ? "inactive" : "active";

    await updateDoc(doc(db, "banners", banner.id), {
      status: newStatus,
    });

    loadBanners();
  }

  /* Delete banner */
  async function removeBanner(banner) {
    if (!confirm("Delete this banner?")) return;

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

    // backward compatibility - old field
    if (banner.imageURL) {
      await deleteObject(ref(storage, banner.imageURL)).catch(() => {});
    }

    if (banner.image) {
      await deleteObject(ref(storage, banner.image)).catch(() => {});
    }

    await deleteDoc(doc(db, "banners", banner.id));

    loadBanners();
  }

  /* Get preview URL (desktop prioritized) */
  function getPreview(b) {
    return (
      b.image_desktop ||
      b.imageURL || // old
      b.image || // old
      ""
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Manage Banners</h2>

      <div style={{ display: "grid", gap: 20 }}>
        {banners.map((b) => (
          <div
            key={b.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 10,
            }}
          >
            {/* Preview */}
            {getPreview(b) ? (
              <img
                src={getPreview(b)}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 160,
                  background: "#eee",
                  borderRadius: 10,
                }}
              />
            )}

            <p><b>Order:</b> {b.order}</p>

            <p>
              <b>Status:</b>{" "}
              <span style={{ color: b.status === "active" ? "green" : "red" }}>
                {b.status}
              </span>
            </p>

            <div style={{ marginTop: 10 }}>
              <button onClick={() => toggleStatus(b)}>
                {b.status === "active" ? "Disable" : "Enable"}
              </button>

              <a
                href={`/edit-banner/${b.id}`}
                style={{
                  marginLeft: 10,
                  padding: "6px 10px",
                  background: "#0c7",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 6,
                }}
              >
                Edit
              </a>

              <button
                onClick={() => removeBanner(b)}
                style={{
                  marginLeft: 10,
                  padding: "6px 10px",
                  background: "#e00",
                  color: "#fff",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
