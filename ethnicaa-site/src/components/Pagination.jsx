"use client";

import React from "react";
import Link from "next/link";

const Pagination = ({ totalPages, currentPage, basePath, searchParams = {} }) => {
  if (totalPages <= 1) return null;

  // Helper to generate the URL with all current search params plus the new page
  const getPageUrl = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    return `${basePath}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const showMax = 5; // Number of page buttons to show

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + showMax - 1);

    if (endPage - startPage + 1 < showMax) {
      startPage = Math.max(1, endPage - showMax + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          style={{
            ...styles.pageLink,
            ...(i === currentPage ? styles.activePage : {}),
          }}
        >
          {i}
        </Link>
      );
    }

    return pages;
  };

  return (
    <div style={styles.paginationContainer}>
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link href={getPageUrl(currentPage - 1)} style={styles.prevNext}>
          &laquo; Prev
        </Link>
      ) : (
        <span style={{ ...styles.prevNext, ...styles.disabled }}>&laquo; Prev</span>
      )}

      {/* Page Numbers */}
      <div style={styles.pageNumbers}>
        {currentPage > 3 && (
            <>
                <Link href={getPageUrl(1)} style={styles.pageLink}>1</Link>
                {currentPage > 4 && <span style={styles.ellipsis}>...</span>}
            </>
        )}
        {renderPageNumbers()}
        {currentPage < totalPages - 2 && (
            <>
                {currentPage < totalPages - 3 && <span style={styles.ellipsis}>...</span>}
                <Link href={getPageUrl(totalPages)} style={styles.pageLink}>{totalPages}</Link>
            </>
        )}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link href={getPageUrl(currentPage + 1)} style={styles.prevNext}>
          Next &raquo;
        </Link>
      ) : (
        <span style={{ ...styles.prevNext, ...styles.disabled }}>Next &raquo;</span>
      )}
    </div>
  );
};

const styles = {
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "40px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  pageNumbers: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  pageLink: {
    padding: "8px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#000",
    fontWeight: "600",
    background: "#f0f0f0",
    transition: "all 0.2s ease",
    fontSize: "14px",
    border: "1px solid transparent",
  },
  activePage: {
    background: "#000",
    color: "#fff",
  },
  prevNext: {
    padding: "8px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#000",
    fontWeight: "700",
    background: "#fff",
    border: "2px solid #000",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  disabled: {
    opacity: 0.3,
    cursor: "not-allowed",
    borderColor: "#ccc",
  },
  ellipsis: {
    padding: "0 5px",
    fontWeight: "bold",
    color: "#888",
  }
};

export default Pagination;
