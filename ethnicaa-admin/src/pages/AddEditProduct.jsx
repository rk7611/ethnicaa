/** 
 * UPDATED AddEditProduct.jsx with FULL SEO SUPPORT
 * -------------------------------------------------------------
 * ✔ SEO Section (Clean Box UI)
 * ✔ seo_title
 * ✔ seo_description
 * ✔ seo_keywords
 * ✔ seo_slug (auto)
 * ✔ seo_alt (auto)
 * ✔ color field added
 * ✔ Uses fabricNames, work, categoryNames to auto-generate SEO
 * ✔ Fully merged into existing product saving logic
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import slugify from "../utils/slugify";
import TagInput from "../components/TagInput";
import useCategories from "../hooks/useCategories";
import useFabrics from "../hooks/useFabrics";
import { db, storage } from "../firebase";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

/* -----------------------------------------------------------
   HELPERS
------------------------------------------------------------ */

/** Convert pretty name → slug */
function toSlug(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Convert slug → Pretty Name */
function toPretty(slug) {
  if (!slug) return "";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Build deep search keywords */
function generateSearchKeywords(product) {
  const keywords = new Set();

  const pushWords = (text) => {
    if (!text) return;
    const words = text.toLowerCase().split(/[\s,.-]+/);
    for (let i = 0; i < words.length; i++) {
      let phrase = words[i];
      if (!phrase) continue;
      keywords.add(phrase);
      for (let j = i + 1; j < words.length; j++) {
        phrase += " " + words[j];
        keywords.add(phrase);
      }
    }
  };

  pushWords(product.name);
  pushWords(product.catalog);
  product.categoryNames?.forEach((p) => pushWords(p));
  product.fabricNames?.forEach((p) => pushWords(p));
  pushWords(product.rawSpecs);
  pushWords(product.description);

  return Array.from(keywords).slice(0, 150);
}

/** Auto create category document if not exists */
async function ensureCategoryDoc(prettyName) {
  if (!prettyName) return null;

  const slug = toSlug(prettyName);
  const refCat = doc(db, "categories", slug);
  const snap = await getDoc(refCat);

  if (!snap.exists()) {
    await setDoc(refCat, {
      name: prettyName,
      slug,
      cover: "",
      count: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  return { slug, pretty: prettyName };
}

export default function AddEditProduct({ mode }) {
  const { id } = useParams();
  const nav = useNavigate();

  const { categories: catList } = useCategories();
  const { fabrics: fabList, ensureFabric } = useFabrics();

  /* ---------------- BASIC DATA ---------------- */
  const [data, setData] = useState({
    name: "",
    brand: "",
    catalog: "",
    description: "",
    rawSpecs: "",
    note: "",
    availability: "",
    dispatchTime: "",
    offer: false,

    price: "",
    pcs: "",
    gst: 5,

    avg_price: "",
    full_price: "",
    full_price_with_gst: "",

    status: "draft",
  });

  const [slug, setSlug] = useState("");
  const [categoryNames, setCategoryNames] = useState([]);
  const [fabricNames, setFabricNames] = useState([]);
  const [color, setColor] = useState("");

  /* ---------------- SEO STATE ---------------- */
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoSlug, setSeoSlug] = useState("");
  const [seoAlt, setSeoAlt] = useState("");

  /* ---------------- IMAGES ---------------- */
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [coverIdx, setCoverIdx] = useState(0);
  const dragIndex = useRef(null);

  /* ---------------- PDF / ZIP ---------------- */
  const [pdfUrl, setPdfUrl] = useState("");
  const [zipUrl, setZipUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);

  /* ---------------- PROGRESS ---------------- */
  const [progressText, setProgressText] = useState("");

  /* ---------------- LOAD EDIT PRODUCT ---------------- */
  useEffect(() => {
    if (mode === "edit" && id) {
      getDoc(doc(db, "products", id)).then((snap) => {
        if (!snap.exists()) return;
        const d = snap.data();

        setData({ ...data, ...d });
        setSlug(d.slug);

        setCategoryNames(d.categoryNames || []);
        setFabricNames(d.fabricNames || []);
        setColor(d.color || "");

        setSeoTitle(d.seo_title || "");
        setSeoDescription(d.seo_description || "");
        setSeoKeywords(d.seo_keywords || "");
        setSeoSlug(d.seo_slug || d.slug);
        setSeoAlt(d.seo_alt || "");

        setImages(d.images || []);
        setCoverIdx(d.images?.indexOf(d.coverImage) || 0);
        setPdfUrl(d.catalogAssets?.pdf || "");
        setZipUrl(d.catalogAssets?.zip || "");
      });
    }
  }, [id, mode]);

  /* ---------------- AUTO SLUG ---------------- */
  useEffect(() => {
    if (mode === "add") {
      setSlug(slugify(data.name));
      setSeoSlug(slugify(data.name));
    }
  }, [data.name, mode]);

  /* ---------------- AUTO SEO TITLE/DESC ---------------- */
  useEffect(() => {
    if (!data.name) return;

    const fabric = fabricNames[0] || "";
    const work = data.rawSpecs?.slice(0, 20) || "";

    setSeoTitle(`${data.name} | Ethnicaa`);
    setSeoDescription(
      `Buy ${data.name} from Ethnicaa. Fabric: ${fabric}. Details: ${work}. Latest catalogue collection.`
    );

    setSeoKeywords(
      `${data.name}, ${fabric} ${categoryNames.join(
        " "
      )}, Ethnicaa ${categoryNames.join(" ")}`
    );
  }, [data.name, fabricNames, categoryNames, data.rawSpecs]);

  /* ---------------- AUTO SEO ALT TEXT ---------------- */
  useEffect(() => {
    const cat = categoryNames[0] || "";
    const fab = fabricNames[0] || "";
    const clr = color || "";

    setSeoAlt(`${fab} ${cat} ${clr} Ethnicaa`.trim());
  }, [categoryNames, fabricNames, color]);

  /* ---------------- CALCULATE PRICING ---------------- */
  const calculatePricing = () => {
    const price = Number(data.price || 0);
    const pcs = Number(data.pcs || 0);
    const gst = Number(data.gst || 0);

    if (!price || !pcs) {
      alert("Enter Price and PCS first");
      return;
    }

    const full = price * pcs;
    const fullWithGst = +(full * (1 + gst / 100)).toFixed(2);

    setData((prev) => ({
      ...prev,
      avg_price: `INR ${price}`,
      full_price: `INR ${full}`,
      full_price_with_gst: `INR ${fullWithGst}`,
    }));
  };

  /* ---------------- FILE UPLOAD HELPERS ---------------- */
  const uploadFile = (path, file, label) =>
    new Promise((resolve, reject) => {
      const task = uploadBytesResumable(ref(storage, path), file);
      task.on(
        "state_changed",
        (s) => {
          const pct = Math.round((s.bytesTransferred / s.totalBytes) * 100);
          setProgressText(`Uploading ${label}... ${pct}%`);
        },
        reject,
        async () => {
          setProgressText("");
          resolve(await getDownloadURL(task.snapshot.ref));
        }
      );
    });

  const deleteByUrl = async (url) => {
    if (!url) return;
    try {
      await deleteObject(ref(storage, url));
    } catch {}
  };

  const uploadImages = async () => {
    if (!newImages.length) return;
    const uploaded = [];
    for (let file of newImages) {
      const url = await uploadFile(
        `products/${slug}/${file.name}`,
        file,
        "image"
      );
      uploaded.push(url);
    }
    setImages((prev) => [...prev, ...uploaded]);
    setNewImages([]);
  };

  const removeImage = async (idx) => {
    await deleteByUrl(images[idx]);
    setImages(images.filter((_, i) => i !== idx));
    if (coverIdx === idx) setCoverIdx(0);
  };

  const onDrop = (i) => {
    const arr = [...images];
    const [moved] = arr.splice(dragIndex.current, 1);
    arr.splice(i, 0, moved);
    setImages(arr);
  };

  /* -----------------------------------------------------
      SAVE PRODUCT (MAIN LOGIC)
  ------------------------------------------------------ */
  const save = async (publish) => {
    if (!data.name || !data.price) {
      alert("Name and Price required");
      return;
    }

    const finalSlug = seoSlug || slugify(data.name);

    /* ---------- CLEAN + NORMALIZE CATEGORY/FABRIC NAMES ---------- */
    const cleanedPretty = [...new Set(categoryNames.map((c) => toPretty(c)).filter(Boolean))];
    const cleanedSlugs = [...new Set(cleanedPretty.map((c) => toSlug(c)).filter(Boolean))];

    const fabPretty = [...new Set(fabricNames.map((c) => toPretty(c)).filter(Boolean))];
    const fabSlugs = [...new Set(fabPretty.map((c) => toSlug(c)).filter(Boolean))];

    /* ---------- ENSURE CATEGORY DOCS EXIST ---------- */
    for (let name of cleanedPretty) {
      await ensureCategoryDoc(name);
    }

    /* ---------- BUILD SEARCH FIELDS ---------- */
    const search_title = `${data.name} ${data.catalog}`.toLowerCase();
    const search_category = cleanedPretty.join(" ").toLowerCase();
    const search_fabric = fabPretty.join(" ").toLowerCase();
    const search_text = `
      ${data.name}
      ${data.catalog}
      ${cleanedPretty.join(" ")}
      ${fabPretty.join(" ")}
      ${data.description}
      ${data.rawSpecs}
    `.toLowerCase();

    const search_keywords = generateSearchKeywords({
      name: data.name,
      catalog: data.catalog,
      categoryNames: cleanedPretty,
      fabricNames: fabPretty,
      rawSpecs: data.rawSpecs,
      description: data.description,
    });

    /* ---------- SAVE PRODUCT ---------- */
    await setDoc(
      doc(db, "products", finalSlug),
      {
        ...data,

        slug: finalSlug,

        price: Number(data.price),
        pcs: Number(data.pcs),
        gst: Number(data.gst),

        categoryNames: cleanedPretty,
        categories: cleanedSlugs,

        fabricNames: fabPretty,
        fabrics: fabSlugs,
        color: color || "",

        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keywords: seoKeywords,
        seo_slug: finalSlug,
        seo_alt: seoAlt,

        search_title,
        search_category,
        search_fabric,
        search_text,
        search_keywords,

        images,
        coverImage: images[coverIdx] || "",
        catalogAssets: { pdf: pdfUrl, zip: zipUrl },

        status: publish ? "published" : "draft",
        updatedAt: serverTimestamp(),
        ...(mode === "add" && { createdAt: serverTimestamp() }),
      },
      { merge: true }
    );

    nav("/products");
  };

  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      <h1>{mode === "add" ? "Add Product" : "Edit Product"}</h1>

      <input
        placeholder="Product Name *"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />

      <input
        placeholder="Brand"
        value={data.brand}
        onChange={(e) => setData({ ...data, brand: e.target.value })}
      />

      <input
        placeholder="Catalog"
        value={data.catalog}
        onChange={(e) => setData({ ...data, catalog: e.target.value })}
      />

      {/* ----- CATEGORY INPUT ----- */}
      <TagInput
        label="Categories"
        suggestions={catList}
        values={categoryNames}
        setValues={setCategoryNames}
      />

      {/* ----- FABRIC INPUT ----- */}
      <TagInput
        label="Fabrics"
        suggestions={fabList}
        values={fabricNames}
        setValues={setFabricNames}
        onCreate={ensureFabric}
      />

      {/* ----- COLOR ----- */}
      <input
        placeholder="Color (Red, Blue, Black...)"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      {/* -------------------------------------------------
           SEO SECTION UI (CLEAN BOX)
      ---------------------------------------------------*/}
      <div
        style={{
          marginTop: 30,
          padding: 20,
          border: "1px solid #ccc",
          borderRadius: 10,
          background: "#fafafa",
        }}
      >
        <h2 style={{ marginBottom: 10 }}>SEO Settings</h2>

        <input
          placeholder="SEO Title"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
        />

        <input
          placeholder="SEO Description"
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
        />

        <input
          placeholder="SEO Keywords (comma separated)"
          value={seoKeywords}
          onChange={(e) => setSeoKeywords(e.target.value)}
        />

        <input
          placeholder="SEO Slug"
          value={seoSlug}
          onChange={(e) => setSeoSlug(e.target.value)}
        />

        <input
          placeholder="Image ALT Text"
          value={seoAlt}
          onChange={(e) => setSeoAlt(e.target.value)}
        />
      </div>

      <h3>Pricing</h3>
      <input
        type="number"
        placeholder="Price"
        value={data.price}
        onChange={(e) => setData({ ...data, price: e.target.value })}
      />

      <input
        type="number"
        placeholder="PCS"
        value={data.pcs}
        onChange={(e) => setData({ ...data, pcs: e.target.value })}
      />

      <input
        type="number"
        placeholder="GST %"
        value={data.gst}
        onChange={(e) => setData({ ...data, gst: e.target.value })}
      />

      <button onClick={calculatePricing}>Calculate Pricing</button>

      <input
        placeholder="Avg Price"
        value={data.avg_price}
        onChange={(e) => setData({ ...data, avg_price: e.target.value })}
      />

      <input
        placeholder="Full Price"
        value={data.full_price}
        onChange={(e) => setData({ ...data, full_price: e.target.value })}
      />

      <input
        placeholder="Full Price With GST"
        value={data.full_price_with_gst}
        onChange={(e) => setData({ ...data, full_price_with_gst: e.target.value })}
      />

      <textarea
        placeholder="Description"
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
      />

      <textarea
        placeholder="Raw Specs"
        value={data.rawSpecs}
        onChange={(e) => setData({ ...data, rawSpecs: e.target.value })}
      />

      <textarea
        placeholder="Note"
        value={data.note}
        onChange={(e) => setData({ ...data, note: e.target.value })}
      />

      <input
        placeholder="Availability"
        value={data.availability}
        onChange={(e) => setData({ ...data, availability: e.target.value })}
      />

      <input
        placeholder="Dispatch Time"
        value={data.dispatchTime}
        onChange={(e) => setData({ ...data, dispatchTime: e.target.value })}
      />

      <label>
        <input
          type="checkbox"
          checked={data.offer}
          onChange={(e) => setData({ ...data, offer: e.target.checked })}
        />
        Offer Product
      </label>

      <h3>Images</h3>
      <input
        type="file"
        multiple
        onChange={(e) => setNewImages([...e.target.files])}
      />
      {newImages.length > 0 && <button onClick={uploadImages}>Upload Images</button>}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {images.map((u, i) => (
          <div
            key={u}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(i)}
          >
            <img
              src={u}
              onClick={() => setCoverIdx(i)}
              style={{
                width: 80,
                height: 80,
                border: coverIdx === i ? "3px solid gold" : "1px solid #444",
              }}
            />
            <button onClick={() => removeImage(i)}>✕</button>
          </div>
        ))}
      </div>

      <h3>PDF</h3>
      {pdfUrl && (
        <a href={pdfUrl} target="_blank" rel="noreferrer">
          Download PDF
        </a>
      )}
      <input type="file" onChange={(e) => setPdfFile(e.target.files[0])} />
      {pdfFile && <button onClick={uploadPDF}>Upload PDF</button>}

      <h3>ZIP</h3>
      {zipUrl && (
        <a href={zipUrl} target="_blank" rel="noreferrer">
          Download ZIP
        </a>
      )}
      <input type="file" onChange={(e) => setZipFile(e.target.files[0])} />
      {zipFile && <button onClick={uploadZIP}>Upload ZIP</button>}

      {progressText && <p>{progressText}</p>}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => save(false)}>Save Draft</button>
        <button onClick={() => save(true)}>Save & Publish</button>
      </div>
    </AdminLayout>
  );
}
