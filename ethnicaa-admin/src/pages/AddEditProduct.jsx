/** 
 * UPDATED AddEditProduct.jsx with FULL SEO SUPPORT & CATALOG ASSETS
 * -------------------------------------------------------------
 * ✔ SEO Section (Clean Box UI)
 * ✔ Catalog Assets Unit (PDF/ZIP uploads)
 * ✔ Uses categoryNames, fabricNames arrays
 * ✔ Dynamic Search Keyword generation
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

function toSlug(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function toPretty(slug) {
  if (!slug) return "";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

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

  const { categories: catList, ensureCategory } = useCategories();
  const { fabrics: fabList, ensureFabric } = useFabrics();

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
    offer_price: "",
    discount_percent: 0,
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

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoSlug, setSeoSlug] = useState("");
  const [seoAlt, setSeoAlt] = useState("");

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [coverIdx, setCoverIdx] = useState(0);
  const dragIndex = useRef(null);

  const [pdfUrl, setPdfUrl] = useState("");
  const [zipUrl, setZipUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);

  const [progressText, setProgressText] = useState("");

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
        setPdfUrl(d.catalogAssets?.pdf || d.catalog_assets?.pdf || d.catalog_assets?.pdfUrl || d.pdf || "");
        setZipUrl(d.catalogAssets?.zip || d.catalog_assets?.zip || d.catalog_assets?.zipUrl || d.zip || "");
      });
    }
  }, [id, mode]);

  useEffect(() => {
    if (mode === "add") {
      setSlug(slugify(data.name));
      setSeoSlug(slugify(data.name));
    }
  }, [data.name, mode]);

  useEffect(() => {
    if (!data.name) return;
    const fabric = fabricNames[0] || "";
    const work = data.rawSpecs?.slice(0, 20) || "";
    setSeoTitle(`${data.name} | Ethnicaa`);
    setSeoDescription(`Buy ${data.name} from Ethnicaa. Fabric: ${fabric}. Details: ${work}. Latest catalogue collection.`);
    setSeoKeywords(`${data.name}, ${fabric} ${categoryNames.join(" ")}, Ethnicaa ${categoryNames.join(" ")}`);
  }, [data.name, fabricNames, categoryNames, data.rawSpecs]);

  useEffect(() => {
    const cat = categoryNames[0] || "";
    const fab = fabricNames[0] || "";
    const clr = color || "";
    setSeoAlt(`${fab} ${cat} ${clr} Ethnicaa`.trim());
  }, [categoryNames, fabricNames, color]);

  const calculatePricing = () => {
    const price = Number(data.price || 0);
    const pcs = Number(data.pcs || 0);
    const gst = Number(data.gst || 0);
    if (!price || !pcs) {
      alert("Enter Price and PCS first");
      return;
    }

    let activePrice = price;
    let discountPercent = 0;

    if (data.offer && data.offer_price) {
      activePrice = Number(data.offer_price || 0);
      if (activePrice > 0 && price > 0) {
         discountPercent = Math.round(((price - activePrice) / price) * 100);
      }
    }

    const full = activePrice * pcs;
    const fullWithGst = +(full * (1 + gst / 100)).toFixed(2);

    setData((prev) => ({
      ...prev,
      avg_price: `INR ${activePrice}`,
      full_price: `INR ${full}`,
      full_price_with_gst: `INR ${fullWithGst}`,
      discount_percent: discountPercent,
    }));
  };

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
      const url = await uploadFile(`products/${slug}/${file.name}`, file, "image");
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

  const save = async (publish) => {
    if (!data.name || !data.price) {
      alert("⚠️ Name and Price are required!");
      return;
    }
    if (publish && categoryNames.length === 0) {
      alert("❌ Please select at least one CATEGORY before publishing.");
      return;
    }

    const finalSlug = seoSlug || slugify(data.name);
    const cleanedPretty = [...new Set(categoryNames.map((c) => toPretty(c)).filter(Boolean))];
    const cleanedSlugs = [...new Set(cleanedPretty.map((c) => toSlug(c)).filter(Boolean))];
    const fabPretty = [...new Set(fabricNames.map((c) => toPretty(c)).filter(Boolean))];
    const fabSlugs = [...new Set(fabPretty.map((c) => toSlug(c)).filter(Boolean))];

    for (let name of cleanedPretty) {
      await ensureCategoryDoc(name);
    }

    const search_keywords = generateSearchKeywords({
      name: data.name,
      catalog: data.catalog,
      categoryNames: cleanedPretty,
      fabricNames: fabPretty,
      rawSpecs: data.rawSpecs,
      description: data.description,
    });

    setProgressText("Uploading assets...");
    try {
      let finalPdf = pdfUrl;
      let finalZip = zipUrl;
      if (pdfFile) finalPdf = await uploadFile(`products/${finalSlug}/catalog.pdf`, pdfFile, "PDF Catalog");
      if (zipFile) finalZip = await uploadFile(`products/${finalSlug}/images.zip`, zipFile, "ZIP Images");

      await setDoc(doc(db, "products", finalSlug), {
        ...data,
        slug: finalSlug,
        price: Number(data.price),
        offer_price: Number(data.offer_price || 0),
        discount_percent: Number(data.discount_percent || 0),
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
        search_title: `${data.name} ${data.catalog}`.toLowerCase(),
        search_category: cleanedPretty.join(" ").toLowerCase(),
        search_fabric: fabPretty.join(" ").toLowerCase(),
        search_text: `${data.name} ${data.catalog} ${cleanedPretty.join(" ")} ${fabPretty.join(" ")} ${data.description} ${data.rawSpecs}`.toLowerCase(),
        search_keywords,
        images,
        coverImage: images[coverIdx] || "",
        catalogAssets: { pdf: finalPdf, zip: finalZip },
        status: publish ? "published" : "draft",
        updatedAt: serverTimestamp(),
        ...(mode === "add" && { createdAt: serverTimestamp() }),
      }, { merge: true });

      nav("/products");
    } catch (e) {
      alert("Error saving: " + e.message);
    } finally {
      setProgressText("");
    }
  };

  return (
    <AdminLayout>
      <div style={styles.headerRow}>
        <h1 style={styles.pageTitle}>{mode === "add" ? "Create Product" : "Edit Product"}</h1>
        <div style={styles.actionRow}>
          <button style={styles.btnDraft} onClick={() => save(false)}>Save Draft</button>
          <button style={styles.btnPublish} onClick={() => save(true)}>Save & Publish</button>
        </div>
      </div>

      <div style={styles.formGrid}>
        <div style={styles.column}>
          <div style={styles.sectionCard} className="premium-card">
            <h3 style={styles.sectionHeading}>Basic Information</h3>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Product Name *</label>
              <input style={styles.input} value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
            </div>
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Brand</label>
                <input style={styles.input} value={data.brand} onChange={(e) => setData({ ...data, brand: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Catalog / Code</label>
                <input style={styles.input} value={data.catalog} onChange={(e) => setData({ ...data, catalog: e.target.value })} />
              </div>
            </div>
            <label style={styles.label}>Description</label>
            <textarea style={{ ...styles.input, height: 100 }} value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
          </div>

          <div style={styles.sectionCard} className="premium-card">
            <h3 style={styles.sectionHeading}>Categorization & Specs</h3>
            <TagInput label="Categories *" suggestions={catList} values={categoryNames} setValues={setCategoryNames} onCreate={ensureCategory} />
            <TagInput label="Fabrics" suggestions={fabList} values={fabricNames} setValues={setFabricNames} onCreate={ensureFabric} />
            <label style={styles.label}>Dominant Color</label>
            <input style={styles.input} value={color} onChange={(e) => setColor(e.target.value)} />
            <label style={styles.label}>Raw Specs</label>
            <textarea style={{ ...styles.input, height: 80 }} value={data.rawSpecs} onChange={(e) => setData({ ...data, rawSpecs: e.target.value })} />
          </div>
        </div>

        <div style={styles.column}>
          {/* CATALOG ASSETS MOVED TOP */}
          <div style={styles.sectionCard} className="premium-card">
            <h3 style={styles.sectionHeading}>Catalog Assets (PDF/ZIP)</h3>
            <div style={styles.fieldGroup}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={styles.label}>PDF Catalog {pdfUrl && "✅"}</label>
                {pdfUrl && <button type="button" onClick={() => setPdfUrl("")} style={styles.clearBtn}>Clear Existing</button>}
              </div>
              <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} />
              {pdfUrl && <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Current: <a href={pdfUrl} target="_blank" style={{ color: "#D4AF37", fontWeight: 600 }}>View PDF</a></p>}
              {pdfFile && <p style={{ fontSize: 11, color: "#4CAF50", marginTop: 4 }}>New file: {pdfFile.name}</p>}
            </div>
            <div style={styles.fieldGroup}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={styles.label}>ZIP Images {zipUrl && "✅"}</label>
                {zipUrl && <button type="button" onClick={() => setZipUrl("")} style={styles.clearBtn}>Clear Existing</button>}
              </div>
              <input type="file" accept=".zip,.rar,.7z" onChange={e => setZipFile(e.target.files[0])} />
              {zipUrl && <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Current: <a href={zipUrl} target="_blank" style={{ color: "#D4AF37", fontWeight: 600 }}>Download ZIP</a></p>}
              {zipFile && <p style={{ fontSize: 11, color: "#4CAF50", marginTop: 4 }}>New file: {zipFile.name}</p>}
            </div>
          </div>

          <div style={styles.sectionCard} className="premium-card">
            <h3 style={styles.sectionHeading}>Wholesale Pricing & Offers</h3>
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Price per PC *</label>
                <input style={styles.input} type="number" value={data.price} onChange={(e) => setData({ ...data, price: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Total PCS</label>
                <input style={styles.input} type="number" value={data.pcs} onChange={(e) => setData({ ...data, pcs: e.target.value })} />
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 15, marginBottom: 15, alignItems: "center", background: "#1a1a1a", padding: 15, borderRadius: 10, border: "1px solid #333" }}>
              <div>
                <label style={{ ...styles.label, marginBottom: 5 }}>Enable Offer?</label>
                <button
                  type="button"
                  style={{
                    background: data.offer ? "#D4AF37" : "#333",
                    color: data.offer ? "#000" : "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 8,
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                  onClick={() => setData({ ...data, offer: !data.offer })}
                >
                  {data.offer ? "ON" : "OFF"}
                </button>
              </div>
              
              {data.offer && (
                <div style={{ flex: 1 }}>
                  <label style={{ ...styles.label, color: "#D4AF37" }}>Offer Price per PC</label>
                  <input
                    style={{ ...styles.input, borderColor: "#D4AF37" }}
                    type="number"
                    value={data.offer_price || ""}
                    onChange={(e) => setData({ ...data, offer_price: e.target.value })}
                    placeholder="Enter discounted rate"
                  />
                </div>
              )}
            </div>

            <button style={styles.btnCalc} onClick={calculatePricing}>Auto Calculate</button>
            <div style={{ marginTop: 10 }}>
              <label style={styles.label}>Full Set Price</label>
              <input disabled style={styles.inputDisabled} value={data.full_price_with_gst} />
            </div>
            {data.discount_percent > 0 && (
              <p style={{ color: "#4CAF50", fontSize: 13, fontWeight: "bold", marginTop: 8 }}>
                Calculated Discount: {data.discount_percent}% OFF
              </p>
            )}
          </div>

          <div style={styles.sectionCard} className="premium-card">
            <h3 style={styles.sectionHeading}>SEO Suite</h3>
            <label style={styles.label}>SEO Title</label>
            <input style={styles.input} value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
            <label style={styles.label}>Meta Description</label>
            <textarea style={{...styles.input, height: 60}} value={seoDescription} onChange={e => setSeoDescription(e.target.value)} />
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>URL Slug</label>
                <input style={styles.input} value={seoSlug} onChange={e => setSeoSlug(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Image Alt</label>
                <input style={styles.input} value={seoAlt} onChange={e => setSeoAlt(e.target.value)} />
              </div>
            </div>
          </div>

          <div style={styles.sectionCard} className="premium-card">
            <h3 style={styles.sectionHeading}>Media Attachments</h3>
            <input type="file" multiple onChange={(e) => setNewImages([...e.target.files])} />
            {newImages.length > 0 && <button type="button" style={styles.btnSmall} onClick={uploadImages}>Upload {newImages.length} Images</button>}
            <div style={styles.imageGrid}>
              {images.map((u, i) => (
                <div key={u} style={styles.imageBox}>
                  <img src={u} onClick={() => setCoverIdx(i)} style={{ ...styles.thumb, border: coverIdx === i ? "3px solid #D4AF37" : "1px solid #333" }} />
                  <button type="button" style={styles.removeBtn} onClick={() => removeImage(i)}>✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {progressText && <p style={styles.progress}>{progressText}</p>}
    </AdminLayout>
  );
}

const styles = {
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30, flexWrap: "wrap", gap: 20 },
  pageTitle: { fontSize: 32, fontWeight: 800, color: "#D4AF37", margin: 0 },
  actionRow: { display: "flex", gap: 12 },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 25 },
  column: { display: "flex", flexDirection: "column", gap: 25 },
  sectionCard: { background: "#111", padding: 25, borderRadius: 20, border: "1px solid #222" },
  sectionHeading: { fontSize: 18, color: "#fff", marginBottom: 20, borderBottom: "1px solid #333", paddingBottom: 10 },
  fieldGroup: { marginBottom: 15 },
  label: { display: "block", color: "#888", fontSize: 13, marginBottom: 8, fontWeight: 600 },
  input: { width: "100%", background: "#1a1a1a", border: "1px solid #333", padding: "12px 15px", borderRadius: 10, color: "#fff", outline: "none", fontSize: 15 },
  inputDisabled: { width: "100%", background: "#0c0c0c", border: "1px solid #222", padding: "12px 15px", borderRadius: 10, color: "#888", fontSize: 15 },
  row: { display: "flex", gap: 15, marginBottom: 15 },
  btnPublish: { background: "#D4AF37", color: "#000", padding: "12px 25px", borderRadius: 12, fontWeight: 700, border: "none", cursor: "pointer" },
  btnDraft: { background: "#222", color: "#fff", padding: "12px 25px", borderRadius: 12, fontWeight: 600, border: "1px solid #333", cursor: "pointer" },
  btnCalc: { background: "#333", color: "#D4AF37", padding: "10px 15px", borderRadius: 10, fontWeight: 600, border: "1px solid #444", cursor: "pointer", width: "100%" },
  btnSmall: { marginTop: 10, background: "#333", color: "#fff", padding: "8px 15px", borderRadius: 8, border: "none", cursor: "pointer" },
  imageGrid: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 },
  imageBox: { position: "relative" },
  thumb: { width: 75, height: 95, objectFit: "cover", borderRadius: 8, cursor: "pointer" },
  removeBtn: { position: "absolute", top: -5, right: -5, background: "#ff4444", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 12, cursor: "pointer" },
  progress: { textAlign: "center", color: "#D4AF37", marginTop: 20, fontWeight: 600 },
  clearBtn: { background: "none", border: "none", color: "#ff4444", fontSize: 11, cursor: "pointer", padding: 0 }
};
