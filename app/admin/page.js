"use client";

export default function AdminPage() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Ethnicaa Admin Panel</h1>
      <p>Welcome Admin</p>

      <button
        onClick={() => {
          alert("Button working");
        }}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Fetch New Catalogs
      </button>
    </div>
  );
}
