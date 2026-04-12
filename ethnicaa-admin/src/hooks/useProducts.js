import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db, storage } from "../firebase";
import { ref, listAll, deleteObject } from "firebase/storage";
import { useEffect, useState, useCallback } from "react";

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
  const [loading, setLoading] = useState(true);

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
  // LOAD & SORT PRODUCTS
  // =========================
  const loadProducts = useCallback(() => {
    setLoading(true);

    // SAFE base query → ensures createdAt exists (Fix for sorting)
    const baseQuery = query(
      collection(db, "products"),
      where("createdAt", "!=", null)
    );

    let firestoreQuery;

    switch (sortBy) {
      case "price_low":
        firestoreQuery = query(baseQuery, orderBy("price", "asc"));
        break;

      case "price_high":
        firestoreQuery = query(baseQuery, orderBy("price", "desc"));
        break;

      case "name_az":
        firestoreQuery = query(baseQuery, orderBy("name", "asc"));
        break;

      case "name_za":
        firestoreQuery = query(baseQuery, orderBy("name", "desc"));
        break;

      case "newest":
      default:
        firestoreQuery = query(baseQuery, orderBy("createdAt", "desc"));
        break;
    }

    const unsub = onSnapshot(firestoreQuery, (snapshot) => {
      let list = [];

      snapshot.forEach((docItem) => {
        list.push({ id: docItem.id, ...docItem.data() });
      });

      // =========================
      // FRONTEND FILTERS
      // =========================
      list = list.filter((p) => {
        const matchesSearch =
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.slug?.toLowerCase().includes(search.toLowerCase()) ||
          p.brand?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          category ? p.categories?.includes(category) : true;

        const matchesFabric =
          fabric ? p.fabrics?.includes(fabric) : true;

        const matchesStatus = status ? p.status === status : true;

        const matchesOffer =
          offer ? p.offer === (offer === "true") : true;

        const matchesPrice =
          (minPrice ? p.price >= Number(minPrice) : true) &&
          (maxPrice ? p.price <= Number(maxPrice) : true);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesFabric &&
          matchesStatus &&
          matchesOffer &&
          matchesPrice
        );
      });

      setProducts(list);
      setLoading(false);
    });

    return unsub;
  }, [
    search,
    sortBy,
    category,
    fabric,
    status,
    offer,
    minPrice,
    maxPrice,
  ]);

  // Real-time listener
  useEffect(() => {
    const unsub = loadProducts();
    return () => unsub && unsub();
  }, [loadProducts]);

  // =========================
  // PRODUCT ACTIONS
  // =========================
  const toggleStatus = async (id, currentStatus) => {
    await updateDoc(doc(db, "products", id), {
      status: currentStatus === "published" ? "draft" : "published",
    });
  };

  const toggleOffer = async (id, currentOffer) => {
    await updateDoc(doc(db, "products", id), {
      offer: !currentOffer,
    });
  };

  const deleteProduct = async (id, slug) => {
    try {
      await deleteProductFolder(slug);
      await deleteDoc(doc(db, "products", id));
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
  };

  const bulkDraft = async (ids) => {
    for (const id of ids) {
      await updateDoc(doc(db, "products", id), { status: "draft" });
    }
  };

  const bulkOfferOn = async (ids) => {
    for (const id of ids) {
      await updateDoc(doc(db, "products", id), { offer: true });
    }
  };

  const bulkOfferOff = async (ids) => {
    for (const id of ids) {
      await updateDoc(doc(db, "products", id), { offer: false });
    }
  };

  const bulkDelete = async (items) => {
    for (const p of items) {
      await deleteProduct(p.id, p.slug);
    }
  };

  return {
    products,
    loading,

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
  };
}
