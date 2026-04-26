import React from "react";

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + showMax - 1);

    if (endPage - startPage + 1 < showMax) {
      startPage = Math.max(1, endPage - showMax + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          style={{
            ...styles.pageBtn,
            ...(i === currentPage ? styles.activePage : {}),
          }}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div style={styles.container}>
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ ...styles.navBtn, ...(currentPage === 1 ? styles.disabled : {}) }}
      >
        &laquo; Prev
      </button>

      <div style={styles.pageNumbers}>
        {currentPage > 3 && (
          <>
            <button onClick={() => onPageChange(1)} style={styles.pageBtn}>1</button>
            {currentPage > 4 && <span style={styles.ellipsis}>...</span>}
          </>
        )}
        {renderPageNumbers()}
        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && <span style={styles.ellipsis}>...</span>}
            <button onClick={() => onPageChange(totalPages)} style={styles.pageBtn}>{totalPages}</button>
          </>
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ ...styles.navBtn, ...(currentPage === totalPages ? styles.disabled : {}) }}
      >
        Next &raquo;
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "30px",
    marginBottom: "50px",
    flexWrap: "wrap",
  },
  pageNumbers: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  pageBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #333",
    color: "#fff",
    fontWeight: "600",
    background: "#1a1a1a",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  activePage: {
    background: "#D4AF37",
    color: "#000",
    borderColor: "#D4AF37",
  },
  navBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #D4AF37",
    color: "#D4AF37",
    fontWeight: "700",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  disabled: {
    opacity: 0.3,
    cursor: "not-allowed",
    borderColor: "#444",
    color: "#444",
  },
  ellipsis: {
    padding: "0 5px",
    fontWeight: "bold",
    color: "#444",
  },
};
