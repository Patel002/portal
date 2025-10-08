import { motion } from "framer-motion";
import { HashLoader } from "react-spinners";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoaderScreen = ({ message = "Loading data..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={styles.overlay}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={styles.container}
      >
        <img src="/logo.png" alt="Logo" style={styles.logo} />
        <HashLoader color="#007bff" size={70} />
        <p style={styles.message}>{message}</p>

        {/* Skeleton preview for content */}
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
          <div style={styles.skeletonBox}>
            <Skeleton height={25} width={250} />
            <Skeleton height={15} width={200} style={{ marginTop: 10 }} />
            <Skeleton height={15} width={180} style={{ marginTop: 8 }} />
          </div>
          <div style={styles.cardGrid}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={styles.card}>
                <Skeleton height={120} />
                <Skeleton width="80%" style={{ margin: "10px auto" }} />
                <Skeleton width="60%" />
              </div>
            ))}
          </div>
        </SkeletonTheme>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    flexDirection: "column",
    textAlign: "center",
  },
  container: {
    maxWidth: "600px",
    width: "90%",
    textAlign: "center",
  },
  logo: {
    width: "80px",
    marginBottom: "20px",
  },
  message: {
    marginTop: "15px",
    fontSize: "16px",
    color: "#333",
    fontWeight: 500,
  },
  skeletonBox: {
    marginTop: "30px",
    marginBottom: "20px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
};

export default LoaderScreen;
