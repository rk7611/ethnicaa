import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <div style={styles.main}>
        <Navbar />
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    background: "#000",
    minHeight: "100vh",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    padding: "20px",
    color: "#fff",
  },
};
