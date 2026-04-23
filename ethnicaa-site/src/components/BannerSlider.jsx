"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
    <div className="slider-wrapper">
      {banners.map((b, i) => (
        <div 
          key={i} 
          className={`slide-container ${index === i ? "active" : ""}`}
        >
          <Link href={b.link || "#"} prefetch={false}>
            <picture>
              <source media="(max-width: 480px)" srcSet={getMobileTall(b)} />
              <source media="(max-width: 768px)" srcSet={getMobileSquare(b)} />
              <source media="(min-width: 769px)" srcSet={getDesktop(b)} />
              <img
                src={getDesktop(b)}
                className="slide-img"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                alt={b.title ? `${b.title} Wholesale - Ethnicaa` : "Wholesale Ethnic Wear Surat Manufacturer - Ethnicaa"}
                loading="lazy"
              />
            </picture>
          </Link>
        </div>
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
          min-height: 200px;
          background: #f0f0f0;
        }

        .slide-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
          pointer-events: none;
          z-index: 1;
        }

        .slide-container.active {
          opacity: 1;
          pointer-events: auto;
          z-index: 2;
        }

        .slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* Aspect ratios */
        @media (min-width: 769px) {
          .slider-wrapper {
            aspect-ratio: 16 / 6;
            min-height: 350px;
          }
        }

        @media (max-width: 768px) {
          .slider-wrapper {
            aspect-ratio: 16 / 9;
            min-height: 200px;
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
