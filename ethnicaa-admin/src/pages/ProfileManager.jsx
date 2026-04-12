import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { db, storage } from "../firebase";
import {
  doc, getDoc, setDoc, serverTimestamp
} from "firebase/firestore";
import {
  ref, uploadBytes, getDownloadURL
} from "firebase/storage";

export default function ProfileManager() {
  const [data, setData] = useState({
    whatsapp: "",
    instagram: "",
    facebook: "",
    youtube: "",
    address: "",
    email: "",
    returnPolicy: "",
    about: "",
    banners: [],
    logo: "",
    favicon: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [bannerFiles, setBannerFiles] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  // Load existing settings
  useEffect(() => {
    getDoc(doc(db, "settings", "website")).then(snap => {
      if (snap.exists()) {
  const d = snap.data();

  setData(prev => ({
    ...prev,
    ...d,
    banners: Array.isArray(d.banners) ? d.banners : [],
  }));
}

      setLoading(false);
    });
  }, []);

  // Upload file helper
  const upload = async (path, file) => {
    const r = ref(storage, path);
    await uploadBytes(r, file);
    return await getDownloadURL(r);
  };

  const save = async () => {
    setSaving(true);

    // Upload banners (add new ones only)
    let bannerUrls = [...data.banners];
    for (const file of bannerFiles) {
      const url = await upload(`website/banners/${file.name}`, file);
      bannerUrls.push(url);
    }

    // Upload logo
    let logoUrl = data.logo;
    if (logoFile) {
      logoUrl = await upload("website/logo.png", logoFile);
    }

    // Upload favicon
    let faviconUrl = data.favicon;
    if (faviconFile) {
      faviconUrl = await upload("website/favicon.png", faviconFile);
    }

    const payload = {
      ...data,
      banners: bannerUrls,
      logo: logoUrl,
      favicon: faviconUrl,
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "settings", "website"), payload);

    setSaving(false);
    alert("Saved Successfully!");
  };

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1>Profile Manager</h1>

      <div style={styles.grid}>

        <Input label="WhatsApp Number" value={data.whatsapp}
          onChange={v => setData({ ...data, whatsapp: v })} />

        <Input label="Instagram Link" value={data.instagram}
          onChange={v => setData({ ...data, instagram: v })} />

        <Input label="Facebook Link" value={data.facebook}
          onChange={v => setData({ ...data, facebook: v })} />

        <Input label="YouTube Link" value={data.youtube}
          onChange={v => setData({ ...data, youtube: v })} />

        <Input label="Email" value={data.email}
          onChange={v => setData({ ...data, email: v })} />

      </div>

      <textarea
        placeholder="Store Address"
        style={styles.textarea}
        value={data.address}
        onChange={e => setData({ ...data, address: e.target.value })}
      />

      <textarea
        placeholder="Return Policy"
        style={styles.textarea}
        value={data.returnPolicy}
        onChange={e => setData({ ...data, returnPolicy: e.target.value })}
      />

      <textarea
        placeholder="About Us"
        style={styles.textarea}
        value={data.about}
        onChange={e => setData({ ...data, about: e.target.value })}
      />

      {/* Banner upload */}
      <div>
        <label>Banners (Multiple)</label>
        <input type="file" multiple onChange={e => setBannerFiles([...e.target.files])} />
        <div style={styles.previews}>
          {Array.isArray(data.banners) && data.banners.map((b, i) => (
  <img key={i} src={b} style={styles.bannerImg} />
))}
        </div>
      </div>

      {/* Logo upload */}
      <div>
        <label>Logo</label>
        <input type="file" onChange={e => setLogoFile(e.target.files[0])} />
        {data.logo && <img src={data.logo} style={styles.logo} />}
      </div>

      {/* Favicon upload */}
      <div>
        <label>Favicon</label>
        <input type="file" onChange={e => setFaviconFile(e.target.files[0])} />
        {data.favicon && <img src={data.favicon} style={styles.favicon} />}
      </div>

      <button onClick={save} disabled={saving} style={styles.save}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </AdminLayout>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div style={styles.field}>
      <label>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    marginBottom: 20,
  },
  textarea: {
    width: "100%",
    minHeight: 100,
    marginBottom: 20,
    padding: 10,
    background: "#000",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: 6,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  previews: {
    display: "flex",
    gap: 10,
    marginTop: 10,
    flexWrap: "wrap",
  },
  bannerImg: {
    width: 200,
    height: 100,
    objectFit: "cover",
    borderRadius: 6,
  },
  logo: {
    width: 120,
    marginTop: 10,
  },
  favicon: {
    width: 40,
    height: 40,
    marginTop: 10,
  },
  save: {
    marginTop: 20,
    padding: "12px 24px",
    background: "#D4AF37",
    border: 0,
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },
};
