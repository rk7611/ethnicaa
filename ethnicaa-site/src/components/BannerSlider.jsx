"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BannerSlider({ banners = [] }) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  /* -------------------------
     Auto Slide
  ------------------------- */
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearTimeout(timeoutRef.current);
  }, [index, banners.length]);

  const touchStart = useRef(0);

  if (!banners || banners.length === 0) {
    return (
      <div style={{ width: "100%", height: 200, background: "#f2f2f2", borderRadius: 10 }} />
    );
  }
  const handleTouchStart = (e) => (touchStart.current = e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStart.current;

    if (diff > 50) setIndex((prev) => (prev - 1 + banners.length) % banners.length);
    if (diff < -50) setIndex((prev) => (prev + 1) % banners.length);
  };

  /* -------------------------
     Helper: Pick image source
  ------------------------- */
  const getDesktop = (b) =>
    b.image_desktop || b.imageURL || b.image || "";

  const getMobileSquare = (b) =>
    b.image_mobileSquare || b.image_desktop || b.imageURL || b.image || "";

  const getMobileTall = (b) =>
    b.image_mobileTall || b.image_mobileSquare || b.image_desktop || b.imageURL || b.image || "";

  return (
    <div style={localStyles.sliderWrapper}>
      {banners.map((b, i) => (
        <div 
          key={i} 
          style={{
            ...localStyles.slideContainer,
            opacity: index === i ? 1 : 0,
            pointerEvents: index === i ? "auto" : "none",
            zIndex: index === i ? 2 : 1,
          }}
        >
          <Link href={b.link || "#"} prefetch={false} style={{ width: "100%", height: "100%", display: "block" }}>
            <Image
              src={getDesktop(b)}
              alt={b.title ? `${b.title} Wholesale - Ethnicaa` : "Wholesale Ethnic Wear Surat Manufacturer - Ethnicaa"}
              fill
              priority={i === 0}
              sizes="100vw"
              style={{ objectFit: "cover" }}
              fetchPriority={i === 0 ? "high" : "auto"}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />
          </Link>
        </div>
      ))}

      {/* Dots */}
      <div style={localStyles.dots}>
        {banners.map((_, i) => (
          <div
            key={i}
            style={{
              ...localStyles.dot,
              background: i === index ? "#fff" : "#ffffff80",
              width: i === index ? 12 : 10,
              height: i === index ? 12 : 10,
            }}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

const localStyles = {
  sliderWrapper: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderRadius: "12px",
    aspectRatio: "16 / 9",
    background: "#f0f0f0",
  },
  slideContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transition: "opacity 0.8s ease-in-out",
  },
  slideImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
  dots: {
    position: "absolute",
    bottom: "12px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    zIndex: 10,
  },
  dot: {
    borderRadius: "50%",
    cursor: "pointer",
    transition: "0.3s",
  },
};
