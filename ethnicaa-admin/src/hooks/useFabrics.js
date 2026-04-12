import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export default function useFabrics() {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFabrics = async () => {
    try {
      const q = query(collection(db, "fabrics"), orderBy("name"));
      const snap = await getDocs(q);
      setFabrics(snap.docs.map(d => d.data().name));
    } catch (err) {
      console.error("Failed to load fabrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFabrics();
  }, []);

  const ensureFabric = async (name) => {
    if (!name || fabrics.includes(name)) return;

    await addDoc(collection(db, "fabrics"), {
      name,
      createdAt: new Date(),
    });

    // reload list after add
    loadFabrics();
  };

  return { fabrics, ensureFabric, loading };
}
