"use client";

import { useEffect, useState, useRef } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

/* -------------------------------------------------- */
/* NORMALIZATION + SYNONYMS + FUZZY MATCH */
/* -------------------------------------------------- */

const norm = (t) => (t || "").toLowerCase().trim();

const synonyms = {
  saree: ["saree", "sarees", "sari", "saris"],
  kurti: ["kurti", "kurtis", "kurtees", "kurtha"],
  lehanga: ["lehanga", "lehenga", "lengha", "lehngha"],
};

function normalizeKeyword(keyword) {
  keyword = norm(keyword);
  for (const root in synonyms) {
    if (synonyms[root].includes(keyword)) return root;
  }
  return keyword;
}

// Simple Levenshtein fuzzy match (distance <= 1)
function fuzzyMatch(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;

  const dp = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length] <= 1;
}

/* -------------------------------------------------- */
/* SEARCHBOX COMPONENT */
/* -------------------------------------------------- */

export default function SearchBox() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const boxRef = useRef(null);

  /* DEBOUNCE INPUT */
  useEffect(() => {
    if (!input.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(() => {
      runSearch(input);
    }, 250);

    return () => clearTimeout(delay);
  }, [input]);

  /* -------------------------------------------------- */
  /* MAIN SMART SEARCH (matches SearchPage engine)      */
  /* -------------------------------------------------- */

  async function runSearch(text) {
    const keywordRaw = norm(text);
    const keyword = normalizeKeyword(keywordRaw);

    const q = query(
      collection(db, "products"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    const ranked = [];

    snap.docs.forEach((docSnap) => {
      const p = { id: docSnap.id, ...docSnap.data() };

      const name = norm(p.name);
      const catalog = norm(p.catalog);
      const categories = (p.categories || []).map(norm);

      let score = 0;

      /* ---------------- EXACT PHRASE MATCH ---------------- */
      if (name.includes(keywordRaw)) score += 50;
      if (catalog.includes(keywordRaw)) score += 50;

      /* ---------------- EXACT WORD INCLUDES ---------------- */
      if (name.includes(keyword)) score += 30;
      if (catalog.includes(keyword)) score += 30;
      if (categories.includes(keyword)) score += 20;

      /* ---------------- PREFIX MATCH ---------------- */
      if (keyword.length >= 3) {
        if (name.startsWith(keyword)) score += 15;
        if (catalog.startsWith(keyword)) score += 15;
      }

      /* ---------------- SYNONYMS MATCH ---------------- */
      for (const root in synonyms) {
        if (root === keyword) {
          if (
            synonyms[root].some(
              (s) => name.includes(s) || catalog.includes(s)
            )
          ) {
            score += 20;
          }
        }
      }

      /* ---------------- FUZZY TITLE MATCH ---------------- */
      const words = name.split(" ");
      if (words.some((w) => fuzzyMatch(w, keyword))) {
        score += 10;
      }

      /* ---------------- FINAL FILTER ---------------- */
      if (score > 0) {
        ranked.push({ ...p, score });
      }
    });

    /* SORT BY SCORE DESC */
    ranked.sort((a, b) => b.score - a.score);

    setResults(ranked.slice(0, 8));
    setShow(true);
  }

  /* CLOSE DROPDOWN ON OUTSIDE CLICK */
  useEffect(() => {
    function handleClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShow(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  /* ENTER KEY → FULL SEARCH PAGE */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      window.location.href = `/search?keyword=${input}`;
    }
  };

  return (
    <div ref={boxRef} style={styles.wrapper}>
      <input
        placeholder="Search products…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        onFocus={() => input && setShow(true)}
        style={styles.input}
      />

      {/* Results */}
      {show && results.length > 0 && (
        <div style={styles.dropdown}>
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              style={styles.item}
              onClick={() => setShow(false)}
            >
              <Image src={p.images?.[0]} alt={p.catalog || p.name} width={50} height={50} quality={100} style={styles.img} />
              <div>
                <div style={styles.text}>{p.catalog || p.name}</div>
                <div style={styles.subtext}>
                  {(p.categories || []).join(", ")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* STYLES */
const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    top: "105%",
    left: 0,
    right: 0,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    padding: "8px 0",
    zIndex: 99,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    textDecoration: "none",
    color: "#000",
  },
  img: {
    width: 50,
    height: 50,
    objectFit: "cover",
    borderRadius: 6,
  },
  text: {
    fontSize: 15,
    fontWeight: 600,
  },
  subtext: {
    fontSize: 12,
    color: "#777",
  },
};
