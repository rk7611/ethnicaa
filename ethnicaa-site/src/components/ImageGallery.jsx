"use client";

import { useState } from "react";
import Image from "next/image";
import { isValidImageUrl } from "@/utils/imageUtils";

export default function ImageGallery({ images = [], zoom = true, altText = "product" }) {
  const safe = Array.isArray(images) ? images.filter(isValidImageUrl) : [];
  const [active, setActive] = useState(0);

  const [zoomed, setZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [startDist, setStartDist] = useState(null);

  if (!safe.length) return null;

  /* ========================= PINCH ZOOM ====================== */
  function getDistance(touches) {
    const [a, b] = touches;
    return Math.sqrt(
      Math.pow(a.clientX - b.clientX, 2) +
      Math.pow(a.clientY - b.clientY, 2)
    );
  }

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      setStartDist(getDistance(e.touches));
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && startDist) {
      const newDist = getDistance(e.touches);
      const newScale = Math.min(Math.max(newDist / startDist, 1), 3);
      setScale(newScale);
    }
  };

  const resetZoom = () => {
    setScale(1);
    setStartDist(null);
  };

  /* ========================= SWIPE ====================== */
  let touchStartX = 0;

  const onSwipeStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const onSwipeEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;

    if (Math.abs(diff) > 60) {
      diff < 0 ? nextImg() : prevImg();
    }
  };

  /* ========================= NEXT / PREV ====================== */
  const nextImg = () => {
    setActive((a) => (a + 1) % safe.length);
    resetZoom();
  };

  const prevImg = () => {
    setActive((a) => (a - 1 + safe.length) % safe.length);
    resetZoom();
  };

  /* ========================= DOUBLE TAP ====================== */
  let lastTap = 0;
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setScale((s) => (s === 1 ? 2 : 1));
    }
    lastTap = now;
  };

  /* ============================ UI =========================== */

  return (
    <>
      {/* MAIN IMAGE */}
      <div
        style={styles.mainWrapper}
        onClick={() => zoom && setZoomed(true)}
      >
        <Image
          src={safe[active]}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          quality={75}
          style={styles.mainImage}
        />
      </div>

      {/* THUMBNAILS — NOW MULTI-LINE & NEVER BREAKS PAGE */}
      <div style={styles.thumbs}>
        {safe.map((img, i) => (
          <div
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setActive(i);
              resetZoom();
            }}
            style={{
              ...styles.thumbBox,
              border: i === active ? "2px solid #000" : "1px solid #ccc",
            }}
          >
            <Image
              src={img}
              width={70}
              height={70}
              quality={60}
              alt={`${altText} thumbnail ${i + 1}`}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {/* ZOOM OVERLAY */}
      {zoomed && (
        <div
          style={styles.overlay}
          onClick={() => {
            setZoomed(false);
            resetZoom();
          }}
        >
          <Image
            src={safe[active]}
            alt={`${altText} zoomed`}
            width={1000}
            height={1400}
            quality={80}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleTap}
            style={{
              ...styles.zoomImage,
              transform: `scale(${scale})`,
            }}
            onTouchStart={(e) => {
              handleTouchStart(e);
              onSwipeStart(e);
            }}
            onTouchMove={handleTouchMove}
            onTouchEnd={(e) => {
              onSwipeEnd(e);
              handleDoubleTap();
            }}
          />

          {/* ARROWS */}
          <div
            style={styles.leftArrow}
            onClick={(e) => {
              e.stopPropagation();
              prevImg();
            }}
          >
            ⟨
          </div>

          <div
            style={styles.rightArrow}
            onClick={(e) => {
              e.stopPropagation();
              nextImg();
            }}
          >
            ⟩
          </div>
        </div>
      )}
    </>
  );
}

/* ================================ STYLES =============================== */

const styles = {
  mainWrapper: {
    width: "100%",
    height: 500,
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
    cursor: "zoom-in",
    background: "#fafafa",
  },

  mainImage: {
    objectFit: "contain",
  },

  /* ⭐ FIX: MULTI-LINE WRAPPING THUMBNAILS */
  thumbs: {
    display: "flex",
    flexWrap: "wrap",       // ⭐ KEY FIX
    gap: 10,
    marginTop: 12,
    overflow: "visible",    // ⭐ prevents layout breaking
  },

  thumbBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
    cursor: "pointer",
    background: "#fff",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    cursor: "zoom-out",
  },

  zoomImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    objectFit: "contain",
    transition: "transform 0.2s ease-out",
  },

  leftArrow: {
    position: "fixed",
    left: 20,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 50,
    color: "#fff",
    cursor: "pointer",
    userSelect: "none",
  },

  rightArrow: {
    position: "fixed",
    right: 20,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 50,
    color: "#fff",
    cursor: "pointer",
    userSelect: "none",
  },
};
