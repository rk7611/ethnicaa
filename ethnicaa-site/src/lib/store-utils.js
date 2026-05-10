import { db } from "./firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export async function getStoreBySubdomain(subdomain) {
  const q = query(
    collection(db, "reseller_stores"),
    where("subdomain", "==", subdomain),
    limit(1)
  );
  
  const snap = await getDocs(q);
  if (snap.empty) return null;
  
  const data = snap.docs[0].data();
  return { id: snap.docs[0].id, ...data };
}
