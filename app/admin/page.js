"use client";

export default function AdminPage() {

  const handleClick = () => {
    alert("BUTTON CLICK WORKING");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Ethnicaa Admin Panel</h1>
      <p>Welcome Admin</p>

      <button
        onClick={handleClick}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Fetch New Catalogs
      </button>
    </div>
  );
}
