import { useMemo } from "react";
import AdminLayout from "../components/AdminLayout";
import ProductTable from "../components/ProductTable";
import useProducts from "../hooks/useProducts";

export default function ProductsList() {
  const {
    products,
    loading,

    // filters
    search, setSearch,
    category, setCategory,
    fabric, setFabric,
    status, setStatus,
    offer, setOffer,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,

    // sort
    sortBy, setSortBy,

    // actions
    toggleStatus,
    toggleOffer,
    deleteProduct,
    bulkPublish,
    bulkDraft,
    bulkOfferOn,
    bulkOfferOff,
    bulkDelete,
  } = useProducts();

  // Build unique category & fabric lists from data (safe even if empty)
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(set);
  }, [products]);

  const fabrics = useMemo(() => {
    const set = new Set(products.map(p => p.fabric).filter(Boolean));
    return Array.from(set);
  }, [products]);

  // Duplicate handler (deep copy + new slug)
  const onDuplicate = async (p) => {
    const copy = {
      ...p,
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy-${Date.now()}`,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // reuse bulkPublish style API via save by toggling draft first
    // NOTE: actual save will be implemented in Add/Edit step; for now this is a placeholder
    alert("Duplicate created as draft. (Save logic will be finalized in Add/Edit step)");
    console.log("Duplicate payload:", copy);
  };

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: 10 }}>Products</h1>

      {/* FILTERS BAR */}
      <div style={styles.filters}>
        <input
          placeholder="Search name / slug / brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={fabric} onChange={(e) => setFabric(e.target.value)} style={styles.select}>
          <option value="">All Fabrics</option>
          {fabrics.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select value={offer} onChange={(e) => setOffer(e.target.value)} style={styles.select}>
          <option value="">Offer (Any)</option>
          <option value="true">Offer ON</option>
          <option value="false">Offer OFF</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low → High</option>
          <option value="price_high">Price: High → Low</option>
          <option value="name_az">Name A–Z</option>
          <option value="name_za">Name Z–A</option>
        </select>

        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={styles.inputSmall}
        />

        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={styles.inputSmall}
        />
      </div>

      {/* TABLE */}
      <ProductTable
        products={products}
        loading={loading}
        onToggleStatus={toggleStatus}
        onToggleOffer={toggleOffer}
        onDelete={deleteProduct}
        onDuplicate={onDuplicate}
        onBulkPublish={bulkPublish}
        onBulkDraft={bulkDraft}
        onBulkOfferOn={bulkOfferOn}
        onBulkOfferOff={bulkOfferOff}
        onBulkDelete={bulkDelete}
      />
    </AdminLayout>
  );
}

const styles = {
  filters: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "15px",
    background: "#111",
    padding: "10px",
    borderRadius: "8px",
  },
  input: {
    background: "#000",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "6px",
    padding: "8px",
    minWidth: "220px",
  },
  inputSmall: {
    background: "#000",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "6px",
    padding: "8px",
    width: "100px",
  },
  select: {
    background: "#000",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "6px",
    padding: "8px",
  },
};
