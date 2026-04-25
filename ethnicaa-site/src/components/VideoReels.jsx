"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function VideoReels() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReels() {
            try {
                // Fetch products that have a videoUrl using the 'posted_to_social' flag
                const q = query(
                    collection(db, "products"),
                    where("posted_to_social", "==", true),
                    limit(10)
                );
                
                const snap = await getDocs(q);
                const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Sort in memory to avoid index requirements
                list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                
                setReels(list);
            } catch (err) {
                console.error("Error fetching reels:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchReels();
    }, []);

    if (loading && reels.length === 0) return null;
    if (reels.length === 0) return null;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>📺 Latest Product Reels</h2>
            <div style={styles.scrollContainer}>
                {reels.map((reel) => (
                    <div key={reel.id} style={styles.reelCard}>
                        <div style={styles.videoWrapper}>
                            <video 
                                src={reel.videoUrl} 
                                style={styles.video} 
                                controls={false}
                                muted
                                loop
                                onMouseOver={(e) => e.target.play()}
                                onMouseOut={(e) => e.target.pause()}
                                playsInline
                            />
                            <div style={styles.overlay}>
                                <div style={styles.productName}>{reel.catalog || reel.name}</div>
                                <Link href={`/product/${reel.slug}`} style={styles.viewBtn}>
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        marginBottom: 40,
        padding: "0 10px"
    },
    heading: {
        fontSize: 20,
        fontWeight: 800,
        marginBottom: 15,
        color: "#111",
        display: "flex",
        alignItems: "center",
        gap: 8
    },
    scrollContainer: {
        display: "flex",
        gap: 15,
        overflowX: "auto",
        paddingBottom: 15,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
    },
    reelCard: {
        minWidth: 200,
        width: 200,
        height: 350,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        background: "#000",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
    },
    videoWrapper: {
        width: "100%",
        height: "100%",
        position: "relative"
    },
    video: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        cursor: "pointer"
    },
    overlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "20px 10px 10px",
        background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 8
    },
    productName: {
        fontSize: 13,
        fontWeight: 700,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    viewBtn: {
        background: "#fff",
        color: "#000",
        textDecoration: "none",
        fontSize: 11,
        fontWeight: 800,
        padding: "6px 12px",
        borderRadius: 20,
        textAlign: "center",
        textTransform: "uppercase"
    }
};
