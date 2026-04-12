import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductTable({
  products,
  loading,
  onToggleStatus,
  onToggleOffer,
  onDelete,
  onDuplicate,
  onBulkDelete,
  onBulkPublish,
  onBulkDraft,
  onBulkOfferOn,
  onBulkOfferOff
}) {
  const [selected, setSelected] = useState([]);

  // Toggle individual checkbox
  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Select all
  const toggleSelectAll = () => {
    if (selected.length === products.length) {
      setSelected([]);
    } else {
      setSelected(products.map((p) => p.id));
    }
  };

  // Confirm delete
  const confirmDelete = (product) => {
    if (window.confirm("Delete this product permanently?")) {
      onDelete(product.id, product.slug);
    }
  };

  return (
    <div style={styles.container}>
      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div style={styles.bulkBar}>
          <span style={styles.bulkText}>
            {selected.length} selected
          </span>

          <button style={styles.bulkBtn} onClick={() => onBulkPublish(selected)}>
            Publish
          </button>

          <button style={styles.bulkBtn} onClick={() => onBulkDraft(selected)}>
            Draft
          </button>

          <button style={styles.bulkBtn} onClick={() => onBulkOfferOn(selected)}>
            Offer ON
          </button>

          <button style={styles.bulkBtn} onClick={() => onBulkOfferOff(selected)}>
            Offer OFF
          </button>

          <button
            style={styles.bulkDelete}
            onClick={() => {
              if (window.confirm("Delete selected products permanently?")) {
                onBulkDelete(products.filter(p => selected.includes(p.id)));
              }
            }}
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selected.length === products.length && products.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Cover</th>
            <th>Name</th>
            <th>Price</th>
            <th>Offer</th>
            <th>Status</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="10" style={styles.loading}>Loading...</td>
            </tr>
          )}

          {!loading && products.length === 0 && (
            <tr>
              <td colSpan="10" style={styles.loading}>No products found</td>
            </tr>
          )}

          {products.map((p) => (
            <tr key={p.id}>
              {/* Checkbox */}
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                />
              </td>

              {/* Cover Image */}
              <td>
                <img
                  src={p.coverImage || p.images?.[0]}
                  alt=""
                  style={styles.image}
                />
              </td>

              {/* Name */}
              <td style={{ maxWidth: "220px" }}>
                {p.name}
                <div style={styles.slug}>{p.slug}</div>
              </td>

              {/* Price */}
              <td>₹{p.price}</td>

              {/* Offer Toggle */}
              <td>
                <button
                  style={p.offer ? styles.toggleOn : styles.toggleOff}
                  onClick={() => onToggleOffer(p.id, p.offer)}
                >
                  {p.offer ? "ON" : "OFF"}
                </button>
              </td>

              {/* Publish Toggle */}
              <td>
                <button
                  style={
                    p.status === "published" ? styles.published : styles.draft
                  }
                  onClick={() => onToggleStatus(p.id, p.status)}
                >
                  {p.status}
                </button>
              </td>

              {/* Created Date */}
              <td>{p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : "-"}</td>

              {/* Updated Date */}
              <td>{p.updatedAt?.seconds ? new Date(p.updatedAt.seconds * 1000).toLocaleDateString() : "-"}</td>

              {/* Action Buttons */}
              <td>
                <div style={styles.actionRow}>
                  
                  {/* VIEW */}
                  <a
                    href={`/product/${p.slug}`}
                    target="_blank"
                    style={styles.viewBtn}
                  >
                    View
                  </a>

                  {/* EDIT */}
                  <Link to={`/edit-product/${p.id}`} style={styles.editBtn}>
                    Edit
                  </Link>

                  {/* DUPLICATE */}
                  <button
                    onClick={() => onDuplicate(p)}
                    style={styles.dupBtn}
                  >
                    Copy
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => confirmDelete(p)}
                    style={styles.delBtn}
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

//
// STYLES
//
const styles = {
  container: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#fff",
    background: "#111",
  },
  image: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    opacity: 0.8,
  },
  slug: {
    fontSize: "11px",
    opacity: 0.6,
  },
  published: {
    background: "green",
    padding: "4px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    color: "#fff",
    fontSize: "12px",
  },
  draft: {
    background: "#555",
    padding: "4px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    color: "#fff",
    fontSize: "12px",
  },
  toggleOn: {
    background: "#D4AF37",
    padding: "4px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    color: "#000",
    fontSize: "12px",
    fontWeight: "bold",
  },
  toggleOff: {
    background: "#444",
    padding: "4px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    color: "#fff",
    fontSize: "12px",
  },
  actionRow: {
    display: "flex",
    gap: "6px",
  },
  editBtn: {
    background: "#D4AF37",
    padding: "4px 8px",
    borderRadius: "4px",
    textDecoration: "none",
    color: "#000",
    fontSize: "12px",
    fontWeight: "bold",
  },
  viewBtn: {
    background: "#333",
    padding: "4px 8px",
    borderRadius: "4px",
    textDecoration: "none",
    color: "#fff",
    fontSize: "12px",
  },
  dupBtn: {
    background: "#0077ff",
    padding: "4px 8px",
    borderRadius: "4px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
  },
  delBtn: {
    background: "#ff3333",
    padding: "4px 8px",
    borderRadius: "4px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
  },

  // Bulk bar
  bulkBar: {
    background: "#222",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  bulkText: {
    color: "#D4AF37",
    fontWeight: "bold",
  },
  bulkBtn: {
    background: "#D4AF37",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  bulkDelete: {
    background: "#ff3333",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
};
