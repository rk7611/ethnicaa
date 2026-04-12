"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function BannerSlider({ banners = [] }) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  /* -------------------------
     Safety: No banners
  ------------------------- */
  if (!banners || banners.length === 0) {
    return (
      <div style={{ width: "100%", height: 200, background: "#f2f2f2", borderRadius: 10 }} />
    );
  }

  /* -------------------------
     Auto Slide
  ------------------------- */
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  /* -------------------------
     Swipe
  ------------------------- */
  const touchStart = useRef(0);
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
    <div className="slider-wrapper">
      {banners.map((b, i) => (
        <Link key={i} href={b.link || "#"} prefetch={false}>
          <picture>

            {/* Mobile Tall (phones <480px) */}
            <source media="(max-width: 480px)"
              srcSet={getMobileTall(b)}
            />

            {/* Mobile Square (phones <768px) */}
            <source media="(max-width: 768px)"
              srcSet={getMobileSquare(b)}
            />

            {/* Desktop */}
            <source media="(min-width: 769px)"
              srcSet={getDesktop(b)}
            />

            {/* fallback */}
            <img
              src={getDesktop(b)}
              className={`slide ${index === i ? "active" : ""}`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              alt="Banner"
            />
          </picture>
        </Link>
      ))}

      {/* Dots */}
      <div className="dots">
        {banners.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <style jsx>{`
        .slider-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 12px;
        }

        .slide {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0;
          transition: opacity 0.6s ease-in-out;
        }

        .slide.active {
          opacity: 1;
        }

        /* Aspect ratios */
        @media (min-width: 769px) {
          .slider-wrapper {
            aspect-ratio: 16 / 6;
          }
        }

        @media (max-width: 768px) {
          .slider-wrapper {
            aspect-ratio: 16 / 9;
          }
        }

        .dots {
          position: absolute;
          bottom: 12px;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          background: #ffffff80;
          border-radius: 50%;
          cursor: pointer;
          transition: 0.3s;
        }

        .dot.active {
          background: #fff;
          width: 12px;
          height: 12px;
        }
      `}</style>
    </div>
  );
}
