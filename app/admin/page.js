"use client";

import { useEffect } from "react";

export default function AdminPage() {

  useEffect(() => {
    alert("Admin page mounted - CLIENT COMPONENT CONFIRMED");
  }, []);

  const handleClick = () => {
    alert("BUTTON CLICK WORKING");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Ethnicaa Admin Panel</h1>
      <button onClick={handleClick}>
        Fetch New Catalogs
      </button>
    </div>
  );
}
