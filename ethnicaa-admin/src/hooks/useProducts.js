import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db, storage } from "../firebase";
import { ref, listAll, deleteObject } from "firebase/storage";
import { useEffect, useState, useCallback, useRef } from "react";

const PAGE_SIZE = 50;

// =========================
// DELETE STORAGE FOLDER
// =========================
async function deleteProductFolder(slug) {
  try {
    const folderRef = ref(storage, `products/${slug}`);
    const files = await listAll(folderRef);

    for (const item of files.items) {
      await deleteObject(item);
    }
    return true;
  } catch (err) {
    console.error("Failed to delete folder:", err);
    return false;
  }
}

// =========================
// MAIN HOOK
// =========================
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastDoc = useRef(null);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [fabric, setFabric] = useState("");
  const [status, setStatus] = useState("");
  const [offer, setOffer] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Sort
  const [sortBy, setSortBy] = useState("newest");

  // =========================
  // LOAD PRODUCTS (PAGINATED)
  // =========================
  const loadProducts = useCallback(async (isMore = false) => {
    if (isMore) setLoadingMore(true);
    else {
      setLoading(true);
      setProducts([]);
      lastDoc.current = null;
    }

    try {
      let q = collection(db, "products");

      // Equality Filters (Server-side)
      if (status) q = query(q, where("status", "==", status));
      if (offer) q = query(q, where("offer", "==", offer === "true"));
      
      if (category) {
        // Map common category display names to their singular tag counterparts
        const tagMap = {
          "Sarees": "saree",
          "Kurtis": "kurti",
          "Gowns": "gown",
          "Lahanga": "lehenga",
          "Pakistani Suits": "pakistani",
          "Salwar Suits": "salwar suit",
          "Readymade Salwar Suits": "readymade",
          "Semi Stitched Salwar Suit": "semi stitched"
        };
        const tagQuery = tagMap[category] || category.toLowerCase();
        q = query(q, where("tags", "array-contains", tagQuery));
      }

      if (fabric) q = query(q, where("fabrics", "array-contains", fabric.toLowerCase().replace(/\s+/g, "-")));

      // Search (Server-side via search_keywords if it's a single word)
      // Note: Full-text search in Firestore is limited. 
      // If search is complex, we might still need some client-side filtering or a better index.
      // For now, let's keep it simple.

      // Sorting & Pagination
      switch (sortBy) {
        case "price_low":
          q = query(q, orderBy("price", "asc"));
          break;
        case "price_high":
          q = query(q, orderBy("price", "desc"));
          break;
        case "name_az":
          q = query(q, orderBy("name", "asc"));
          break;
        case "name_za":
          q = query(q, orderBy("name", "desc"));
          break;
        case "newest":
        default:
          q = query(q, orderBy("createdAt", "desc"));
          break;
      }

      if (isMore && lastDoc.current) {
        q = query(q, startAfter(lastDoc.current));
      }

      q = query(q, limit(PAGE_SIZE));

      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      // Client-side Filters (for Search and Price Range since Firestore has limits)
      const filteredList = list.filter(p => {
        const matchesSearch = !search || 
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.slug?.toLowerCase().includes(search.toLowerCase()) ||
          p.brand?.toLowerCase().includes(search.toLowerCase());
        
        const matchesPrice =
          (minPrice ? p.price >= Number(minPrice) : true) &&
          (maxPrice ? p.price <= Number(maxPrice) : true);

        return matchesSearch && matchesPrice;
      });

      if (isMore) {
        setProducts(prev => [...prev, ...filteredList]);
      } else {
        setProducts(filteredList);
      }

      lastDoc.current = snapshot.docs[snapshot.docs.length - 1];
      setHasMore(snapshot.docs.length === PAGE_SIZE);

    } catch (err) {
      console.error("Load products error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, sortBy, category, fabric, status, offer, minPrice, maxPrice]);

  // Initial load and filter change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // =========================
  // PRODUCT ACTIONS
  // =========================
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await updateDoc(doc(db, "products", id), { status: newStatus });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const toggleOffer = async (id, currentOffer) => {
    await updateDoc(doc(db, "products", id), { offer: !currentOffer });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, offer: !currentOffer } : p));
  };

  const deleteProduct = async (id, slug) => {
    try {
      await deleteProductFolder(slug);
      await deleteDoc(doc(db, "products", id));
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      console.error("Delete error:", err);
      return false;
    }
  };

  const bulkPublish = async (ids) => {
    for (const id of ids) {
      await updateDoc(doc(db, "products", id), { status: "published" });
    }
    setProducts(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: "published" } : p));
  };

  const bulkDraft = async (ids) => {
    for (const id of ids) {
      await updateDoc(doc(db, "products", id), { status: "draft" });
    }
    setProducts(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: "draft" } : p));
  };

  const bulkOfferOn = async (ids) => {
    for (const id of ids) {
      await updateDoc(doc(db, "products", id), { offer: true });
    }
    setProducts(prev => prev.map(p => ids.includes(p.id) ? { ...p, offer: true } : p));
  };

  const bulkOfferOff = async (ids) => {
    for (const id of ids) {
      await updateDoc(doc(db, "products", id), { offer: false });
    }
    setProducts(prev => prev.map(p => ids.includes(p.id) ? { ...p, offer: false } : p));
  };

  const bulkDelete = async (items) => {
    for (const p of items) {
      await deleteProduct(p.id, p.slug);
    }
  };

  const duplicateProduct = async (p) => {
    const newSlug = `${p.slug}-copy-${Date.now()}`;
    const copy = {
      ...p,
      name: `${p.name} (Copy)`,
      slug: newSlug,
      status: "draft",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    delete copy.id;
    await setDoc(doc(db, "products", newSlug), copy);
    // Refresh to show the new product
    loadProducts();
    return true;
  };

  return {
    products,
    loading,
    loadingMore,
    hasMore,
    loadMore: () => loadProducts(true),

    // Filters
    search,
    setSearch,
    category,
    setCategory,
    fabric,
    setFabric,
    status,
    setStatus,
    offer,
    setOffer,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,

    // Sorting
    sortBy,
    setSortBy,

    // Actions
    toggleStatus,
    toggleOffer,
    deleteProduct,
    bulkPublish,
    bulkDraft,
    bulkOfferOn,
    bulkOfferOff,
    bulkDelete,
    duplicateProduct,
  };
}
