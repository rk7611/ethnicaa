import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const q = query(collection(db, "categories"), orderBy("name"));
      const snap = await getDocs(q);
      setCategories(snap.docs.map(d => d.data().name));
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const ensureCategory = async (name) => {
    if (!name || categories.includes(name)) return;

    await addDoc(collection(db, "categories"), {
      name,
      createdAt: new Date(),
    });

    // reload list after add
    loadCategories();
  };

  return { categories, ensureCategory, loading };
}
