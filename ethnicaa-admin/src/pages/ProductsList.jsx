import { useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
    duplicateProduct,
  } = useProducts();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearch(q);
      // Clean up the URL to avoid confusion after initial search
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearch, setSearchParams]);

  // Build unique category & fabric lists from all products
  const categoriesList = useMemo(() => {
    const all = products.flatMap(p => p.categoryNames || []);
    return [...new Set(all)].filter(Boolean).sort();
  }, [products]);

  const fabricsList = useMemo(() => {
    const all = products.flatMap(p => p.fabricNames || []);
    return [...new Set(all)].filter(Boolean).sort();
  }, [products]);

  // Duplicate handler
  const onDuplicate = async (p) => {
    try {
      await duplicateProduct(p);
      alert("Product duplicated successfully as draft!");
    } catch (err) {
      alert("Failed to duplicate: " + err.message);
    }
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
          {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={fabric} onChange={(e) => setFabric(e.target.value)} style={styles.select}>
          <option value="">All Fabrics</option>
          {fabricsList.map(f => <option key={f} value={f}>{f}</option>)}
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
