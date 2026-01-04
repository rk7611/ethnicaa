"use client";

import { useEffect } from "react";

export default function AdminPage() {

  useEffect(() => {
    alert("Admin page mounted - CLIENT COMPONENT WORKING");
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Ethnicaa Admin Panel</h1>
      <p>If you see an alert, client components are working.</p>
    </div>
  );
}
