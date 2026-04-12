import { useState } from "react";

export default function TagInput({ label, suggestions, values, setValues, onCreate }) {
  const [input, setInput] = useState("");

  const add = async (val) => {
    const v = val.trim();
    if (!v || values.includes(v)) return;
    setValues([...values, v]);
    await onCreate?.(v);
    setInput("");
  };

  const remove = (v) => setValues(values.filter(x => x !== v));

  return (
    <div style={{ marginBottom: 12 }}>
      <label>{label}</label>
      <div style={styles.box}>
        {values.map(v => (
          <span key={v} style={styles.tag}>
            {v}
            <button onClick={() => remove(v)}>×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add(input))}
          list={`${label}-list`}
          placeholder="Type & press Enter"
          style={styles.input}
        />
      </div>
      <datalist id={`${label}-list`}>
        {suggestions.map(s => <option key={s} value={s} />)}
      </datalist>
    </div>
  );
}

const styles = {
  box: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    padding: 8,
    border: "1px solid #333",
    borderRadius: 6,
    background: "#000",
  },
  tag: {
    background: "#D4AF37",
    color: "#000",
    padding: "4px 8px",
    borderRadius: 12,
    display: "flex",
    gap: 6,
    alignItems: "center",
  },
  input: {
    border: "none",
    background: "transparent",
    color: "#fff",
    outline: "none",
    minWidth: 160,
  },
};
