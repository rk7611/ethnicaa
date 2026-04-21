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
            <button key={`rem-${v}`} onClick={() => remove(v)} style={styles.removeBtn}>×</button>
          </span>
        ))}
        <div style={styles.inputWrapper}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add(input))}
            list={`${label}-list`}
            placeholder="Type..."
            style={styles.input}
          />
          <button 
            type="button" 
            onClick={() => add(input)}
            style={styles.addButton}
          >
            +
          </button>
        </div>
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
    flex: 1,
    minWidth: 100,
    padding: "4px 0",
  },
  inputWrapper: {
    display: "flex",
    flex: 1,
    gap: 8,
    alignItems: "center",
  },
  addButton: {
    background: "#333",
    color: "#D4AF37",
    border: "1px solid #444",
    borderRadius: 6,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 20,
    fontWeight: "bold",
  },
  removeBtn: {
    background: "rgba(0,0,0,0.2)",
    border: "none",
    color: "#000",
    cursor: "pointer",
    fontSize: 14,
    marginLeft: 4,
    borderRadius: "50%",
    width: 18,
    height: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
