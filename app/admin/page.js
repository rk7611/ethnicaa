"use client";

import { storage } from "@/lib/firebase";
import { ref, uploadBytes } from "firebase/storage";

export default function AdminPage() {

  const handleUpload = async () => {
    try {
      const file = new File(["Hello Ethnicaa"], "test.txt", {
        type: "text/plain",
      });

      const storageRef = ref(storage, "test/test.txt");
      await uploadBytes(storageRef, file);

      alert("Upload successful 🎉");
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Ethnicaa Admin Panel</h1>
      <p>Welcome Admin</p>

      <button
        onClick={handleUpload}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Test Firebase Upload
      </button>
    </div>
  );
}
