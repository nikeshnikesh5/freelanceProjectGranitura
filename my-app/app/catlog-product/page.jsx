 "use client";

import { useState, useEffect, useRef } from "react";
import SpecialistScheduler from "../component/SpecialistScheduler";
import PRODUCTS from "../../data/db.json";




// ─────────────────────────────────────────────

// PRODUCT DATA ARRAY

// ─────────────────────────────────────────────

const CATEGORIES = ["All", "Marble", "Granite", "Natural Stone"];



// ─────────────────────────────────────────────

// QUOTE MODAL

// ─────────────────────────────────────────────

function QuoteModal({ product, onClose }) {

  const [grade, setGrade] = useState(Object.keys(product.pricing)[0]);

  const [qty, setQty] = useState(200);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [sent, setSent] = useState(false);



  const pricePerSqft = product.pricing[grade];

  const total = pricePerSqft * qty;



  const handleSend = () => {

    if (!name.trim() || !email.trim()) return;

    setSent(true);

  };



  useEffect(() => {

    const handleKey = (e) => { if (e.key === "Escape") onClose(); };

    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);

  }, [onClose]);



  return (

    <div style={m.overlay} onClick={onClose}>

      <div style={m.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}

        <div style={m.modalHeader}>

          <div>

            <div style={m.modalEye}>Instant Quote</div>

            <div style={m.modalTitle}>{product.name}</div>

          </div>

          <button style={m.closeBtn} onClick={onClose}>✕</button>

        </div>



        {sent ? (

          <div style={m.successBox}>

            <div style={m.successIcon}>

              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">

                <circle cx="22" cy="22" r="21" stroke="#d4bc8a" strokeWidth="1.5"/>

                <path d="M13 22l6 6 12-12" stroke="#d4bc8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

              </svg>

            </div>

            <div style={m.successTitle}>Quote Sent!</div>

            <div style={m.successText}>

              Our team will send a detailed quote to <strong style={{ color: "#d4bc8a" }}>{email}</strong> within 24 hours.

            </div>

            <button style={m.successClose} onClick={onClose}>Done</button>

          </div>

        ) : (

          <>

            {/* Product thumb + live price */}

            <div style={m.productRow}>

              <img src={product.image} alt={product.name} style={m.productThumb} />

              <div style={m.productInfo}>

                <div style={m.livePrice}>

                  <span style={m.livePriceVal}>₹{pricePerSqft.toLocaleString()}</span>

                  <span style={m.livePriceUnit}>/ {product.unit}</span>

                </div>

                <div style={m.liveTotal}>

                  Estimated Total: <strong style={{ color: "#d4bc8a" }}>₹{total.toLocaleString()}</strong>

                </div>

                <div style={m.liveMeta}>MOQ: {product.moq} · Lead: {product.leadTime}</div>

              </div>

            </div>



            {/* Grade selector */}

            <div style={m.fieldGroup}>

              <label style={m.label}>Quality Grade</label>

              <div style={m.gradeGrid}>

                {Object.keys(product.pricing).map(g => (

                  <button key={g} style={{ ...m.gradeBtn, ...(grade === g ? m.gradeBtnActive : {}) }}

                    onClick={() => setGrade(g)}>

                    <span style={m.gradeName}>{g}</span>

                    <span style={m.gradePrice}>₹{product.pricing[g]}/{product.unit}</span>

                  </button>

                ))}

              </div>

            </div>



            {/* Quantity */}

            <div style={m.fieldGroup}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                <label style={m.label}>Quantity ({product.unit})</label>

                <span style={m.qtyDisplay}>{qty} {product.unit}</span>

              </div>

              <input type="range" min="50" max="5000" step="50" value={qty}

                onChange={e => setQty(Number(e.target.value))} style={m.slider} />

              <div style={m.sliderLabels}>

                <span>50</span><span>5,000 {product.unit}</span>

              </div>

            </div>



            {/* Contact */}

            <div style={m.fieldGroup}>

              <label style={m.label}>Your Details</label>

              <div style={m.contactGrid}>

                <input style={m.input} placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} />

                <input style={m.input} placeholder="Company Email *" value={email} onChange={e => setEmail(e.target.value)} type="email" />

                <input style={{ ...m.input, gridColumn: "1/-1" }} placeholder="Phone / WhatsApp" value={phone} onChange={e => setPhone(e.target.value)} type="tel" />

              </div>

            </div>



            <button

              style={{ ...m.sendBtn, opacity: (!name.trim() || !email.trim()) ? 0.5 : 1 }}

              onClick={handleSend}

              disabled={!name.trim() || !email.trim()}>

              Send Quote Request →

            </button>

          </>

        )}

      </div>

    </div>

  );

}



// ─────────────────────────────────────────────

// DETAIL DRAWER

// ─────────────────────────────────────────────

function DetailDrawer({ product, onClose, onQuote }) {

  const [activeTab, setActiveTab] = useState("overview");

  const [grade, setGrade] = useState(Object.keys(product.pricing)[0]);



  useEffect(() => {

    const handleKey = (e) => { if (e.key === "Escape") onClose(); };

    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);

  }, [onClose]);



  return (

    <div style={d.overlay} onClick={onClose}>

      <div style={d.drawer} onClick={e => e.stopPropagation()}>

        {/* Image hero */}

        <div style={d.imgWrap}>

          <img src={product.image} alt={product.name} style={d.img} />

          <div style={d.imgOverlay} />

          <button style={d.closeBtn} onClick={onClose}>✕</button>

          <div style={d.imgMeta}>

            <span style={{ ...d.tag, background: product.tagColor + "22", borderColor: product.tagColor, color: product.tagColor }}>

              {product.tag}

            </span>

            <h2 style={d.imgTitle}>{product.name}</h2>

            <div style={d.imgOrigin}>

              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c8dfd1" strokeWidth="1.5">

                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>

              </svg>

              {product.origin}

            </div>

          </div>

        </div>



        {/* Tabs */}

        <div style={d.tabs}>

          {["overview", "specifications", "applications", "pricing"].map(tab => (

            <button key={tab} style={{ ...d.tab, ...(activeTab === tab ? d.tabActive : {}) }}

              onClick={() => setActiveTab(tab)}>

              {tab.charAt(0).toUpperCase() + tab.slice(1)}

            </button>

          ))}

        </div>



        <div style={d.body}>

          {activeTab === "overview" && (

            <div>

              <p style={d.longDesc}>{product.longDesc}</p>

              <div style={d.metaRow}>

                <div style={d.metaItem}>

                  <span style={d.metaLabel}>MOQ</span>

                  <span style={d.metaVal}>{product.moq}</span>

                </div>

                <div style={d.metaItem}>

                  <span style={d.metaLabel}>Lead Time</span>

                  <span style={d.metaVal}>{product.leadTime}</span>

                </div>

                <div style={d.metaItem}>

                  <span style={d.metaLabel}>Availability</span>

                  <span style={{ ...d.metaVal, color: product.inStock ? "#4a8a5e" : "#e8a090" }}>

                    {product.inStock ? "In Stock" : "Pre-order"}

                  </span>

                </div>

              </div>

            </div>

          )}



          {activeTab === "specifications" && (

            <div style={d.specsGrid}>

              {Object.entries(product.specs).map(([k, v]) => (

                <div key={k} style={d.specRow}>

                  <span style={d.specKey}>{k}</span>

                  <span style={d.specVal}>{v}</span>

                </div>

              ))}

            </div>

          )}



          {activeTab === "applications" && (

            <div>

              <p style={d.appIntro}>This stone is commonly used for:</p>

              <div style={d.appGrid}>

                {product.applications.map(a => (

                  <div key={a} style={d.appTag}>

                    <span style={d.appDot}>◆</span> {a}

                  </div>

                ))}

              </div>

            </div>

          )}



          {activeTab === "pricing" && (

            <div>

              <div style={d.pricingGrid}>

                {Object.entries(product.pricing).map(([g, p]) => (

                  <div key={g}

                    style={{ ...d.priceCard, ...(grade === g ? d.priceCardActive : {}) }}

                    onClick={() => setGrade(g)}>

                    <div style={d.pGrade}>{g}</div>

                    <div style={d.pPrice}>₹{p}</div>

                    <div style={d.pUnit}>per {product.unit}</div>

                  </div>

                ))}

              </div>

              <div style={d.priceNote}>

                * Prices are indicative. Final pricing depends on volume, destination and finish. Contact us for a binding quote.

              </div>

            </div>

          )}

        </div>



        {/* CTA */}

        <div style={d.footer}>

          <button style={d.quoteBtn} onClick={() => { onClose(); onQuote(product); }}>

            Get Instant Quote

          </button>

        </div>

      </div>

    </div>

  );

}



// ─────────────────────────────────────────────

// PRODUCT CARD

// ─────────────────────────────────────────────

function ProductCard({ product, onQuote, onDetail, index }) {

  const [grade, setGrade] = useState(Object.keys(product.pricing)[0]);

  const [hovered, setHovered] = useState(false);

  const price = product.pricing[grade];



  return (

    <div

      style={{

        ...c.card,

        ...(hovered ? c.cardHover : {}),

        animationDelay: `${index * 0.08}s`,

      }}

      onMouseEnter={() => setHovered(true)}

      onMouseLeave={() => setHovered(false)}>



      {/* Image */}

      <div style={c.imgWrap}>

        <img

          src={product.image}

          alt={product.name}

          style={{ ...c.img, transform: hovered ? "scale(1.08)" : "scale(1)" }}

        />

        {/* Gradient */}

        <div style={{ ...c.imgGrad, opacity: hovered ? 1 : 0 }} />



        {/* Tag */}

        <div style={{

          ...c.tag,

          background: product.tagColor + "22",

          border: `1px solid ${product.tagColor}55`,

          color: product.tagColor,

        }}>

          {product.tag}

        </div>



        {/* Category */}

        <div style={c.category}>{product.category}</div>



        {/* Out of stock overlay */}

        {!product.inStock && (

          <div style={c.outOfStock}>Pre-order</div>

        )}



        {/* Hover CTA */}

        <div style={{ ...c.hoverCta, opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(10px)" }}>

          <button style={c.hoverDetail} onClick={() => onDetail(product)}>View Details</button>

        </div>

      </div>



      {/* Content */}

      <div style={c.content}>

        <div style={c.origin}>

          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 4 }}>

            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>

          </svg>

          {product.origin}

        </div>



        <h3 style={c.name}>{product.name}</h3>

        <p style={c.desc}>{product.description}</p>



        {/* Quality selector */}

        <div style={c.qualityWrap}>

          <div style={c.qualityLabel}>Quality Standard</div>

          <div style={c.gradeGrid}>

            {Object.keys(product.pricing).map(g => (

              <button key={g}

                style={{ ...c.gradeBtn, ...(grade === g ? c.gradeBtnActive : {}) }}

                onClick={() => setGrade(g)}>

                {g.replace(" Grade", "").replace(" Quality", "")}

              </button>

            ))}

          </div>

        </div>



        {/* Footer */}

        <div style={c.footer}>

          {/* <div style={c.priceWrap}>

            <span style={c.priceLabel}>From</span>

            <span style={c.price}>₹{price.toLocaleString()}</span>

            <span style={c.priceUnit}>/{product.unit}</span>

          </div> */}

          <div style={c.actions}>

            <button style={c.btnDetail} onClick={() => onDetail(product)}>

              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>

              </svg>

              Details

            </button>

            <button style={c.btnQuote} onClick={() => onQuote(product)}>

              Get Quote

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}



// ─────────────────────────────────────────────

// MAIN PAGE

// ─────────────────────────────────────────────

export default function StoneCatalog() {

  const [activeFilter, setActiveFilter] = useState("All");

  const [quoteProduct, setQuoteProduct] = useState(null);

  const [detailProduct, setDetailProduct] = useState(null);
   
  const [openScheduler, setOpenScheduler] = useState(false);



  const filtered = activeFilter === "All"

    ? PRODUCTS

    : PRODUCTS.filter(p => p.category === activeFilter);



  // Prevent body scroll when modal open

  useEffect(() => {

    document.body.style.overflow = (quoteProduct || detailProduct) ? "hidden" : "";

    return () => { document.body.style.overflow = ""; };

  }, [quoteProduct, detailProduct]);



  return (

    <div style={p.page}>

      {/* ── HERO ── */}

      <div style={p.hero}>

        <div style={p.heroInner}>

          <div style={p.heroEye}>Premium Collection — Est. 2008</div>

          <h1 style={p.heroTitle}>

            Luxury Stone<br />

            <em style={p.heroTitleEm}>Catalog</em>

          </h1>

          <div style={p.heroRule} />

          <p style={p.heroSub}>

            Discover timeless marble, granite and natural stone sourced from

            India's finest quarries — curated for architects, developers and

            discerning international buyers.

          </p>

          <div style={p.heroStats}>

            {[["500+", "Stone Varieties"], ["20+", "Years Expertise"], ["4", "Export Markets"], ["ISO 9001", "Certified"]].map(([num, label]) => (

              <div key={label} style={p.heroStat}>

                <div style={p.heroStatNum}>{num}</div>

                <div style={p.heroStatLabel}>{label}</div>

              </div>

            ))}

          </div>

        </div>

      </div>



      {/* ── FILTERS ── */}

      <div style={p.filterBar}>

        <div style={p.filterInner}>

          <div style={p.filterLabel}>Filter by type</div>

          <div style={p.filterBtns}>

            {CATEGORIES.map(cat => (

              <button key={cat}

                style={{ ...p.filterBtn, ...(activeFilter === cat ? p.filterBtnActive : {}) }}

                onClick={() => setActiveFilter(cat)}>

                {cat}

                {cat !== "All" && (

                  <span style={p.filterCount}>

                    {PRODUCTS.filter(pr => pr.category === cat).length}

                  </span>

                )}

              </button>

            ))}

          </div>

          <div style={p.resultCount}>{filtered.length} products</div>

        </div>

      </div>



      {/* ── GRID ── */}

      <div style={p.catalogWrap}>

        <div style={p.grid}>

          {filtered.map((product, i) => (

            <ProductCard

              key={product.id}

              product={product}

              index={i}

              onQuote={setQuoteProduct}

              onDetail={setDetailProduct}

            />

          ))}

        </div>

      </div>



      {/* ── CTA BANNER ── */}

      <div style={p.ctaBanner}>

        <div style={p.ctaInner}>

          <div style={p.ctaLeft}>

            <div style={p.ctaEye}>Custom Requirements?</div>

            <h2 style={p.ctaTitle}>Need a bespoke stone solution?</h2>

            <p style={p.ctaSub}>

              Our specialists handle custom cutting, bookmatched panels, and bulk procurement

              for projects of any scale — from single apartments to landmark towers.

            </p>

          </div>

           {/* <button
    style={p.ctaBtn}
    onClick={() => setOpenScheduler(true)}
  >
    Talk to a Specialist →
  </button> */}

  <SpecialistScheduler
    isOpen={openScheduler}
    onClose={() => setOpenScheduler(false)}
    specialistName="Dr. Elena Marsh"
    onConfirm={(booking) => console.log(booking)}
  />

    

        </div>

      </div>



      {/* ── MODALS ── */}

      {quoteProduct && (

        <QuoteModal product={quoteProduct} onClose={() => setQuoteProduct(null)} />

      )}

      {detailProduct && (

        <DetailDrawer

          product={detailProduct}

          onClose={() => setDetailProduct(null)}

          onQuote={(prod) => setQuoteProduct(prod)}

        />

      )}

    </div>

  );

}



/* ═══════════════════════════════════════

   STYLES

═══════════════════════════════════════ */



// Page

const p = {

  page: {

    minHeight: "100vh",

    background: "#f9faf8",

    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",

    color: "#1a2420",

  },

  hero: {

    background: "linear-gradient(160deg, #1a3a2a 0%, #0f2318 60%, #1a3a2a 100%)",

    padding: "80px 8% 72px",

    position: "relative",

    overflow: "hidden",

  },

  heroInner: { maxWidth: "720px", position: "relative", zIndex: 1 },

  heroEye: {

    fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase",

    color: "#b8a070", marginBottom: "20px", fontWeight: "500",

  },

  heroTitle: {

    fontSize: "clamp(2.8rem,6vw,4.5rem)", fontWeight: "300",

    color: "#f9faf8", lineHeight: "1.08", margin: "0 0 24px",

    fontFamily: "Georgia, 'Times New Roman', serif",

  },

  heroTitleEm: { color: "#d4bc8a", fontStyle: "italic" },

  heroRule: { width: "48px", height: "1px", background: "#b8a070", marginBottom: "24px" },

  heroSub: {

    fontSize: "1rem", color: "#c8dfd1", lineHeight: "1.8",

    maxWidth: "500px", marginBottom: "48px", fontWeight: "300",

  },

  heroStats: {

    display: "flex", gap: "40px", flexWrap: "wrap",

    paddingTop: "32px", borderTop: "1px solid rgba(200,223,209,0.15)",

  },

  heroStat: {},

  heroStatNum: {

    fontFamily: "Georgia, serif", fontSize: "1.8rem", fontWeight: "300",

    color: "#d4bc8a", lineHeight: "1",

  },

  heroStatLabel: {

    fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase",

    color: "#c8dfd1", marginTop: "4px",

  },



  filterBar: {

    background: "#f4f0e8",

    borderBottom: "1px solid rgba(74,138,94,0.12)",

    padding: "0 8%",

    position: "sticky", top: "0", zIndex: "50",

  },

  filterInner: {

    display: "flex", alignItems: "center", gap: "16px",

    padding: "16px 0", flexWrap: "wrap",

  },

  filterLabel: {

    fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase",

    color: "#7a9080", fontWeight: "600", flexShrink: 0,

  },

  filterBtns: { display: "flex", gap: "6px", flexWrap: "wrap", flex: 1 },

  filterBtn: {

    fontSize: "12px", letterSpacing: "0.5px", fontWeight: "500",

    padding: "7px 16px", border: "1px solid rgba(74,138,94,0.2)",

    background: "transparent", cursor: "pointer", borderRadius: "2px",

    color: "#7a9080", display: "flex", alignItems: "center", gap: "6px",

    transition: "all 0.2s",

  },

  filterBtnActive: {

    background: "#1a3a2a", color: "#f9faf8", borderColor: "#1a3a2a",

  },

  filterCount: {

    fontSize: "10px", background: "rgba(74,138,94,0.15)",

    borderRadius: "10px", padding: "1px 6px", color: "#4a8a5e",

  },

  resultCount: {

    marginLeft: "auto", fontSize: "11px", color: "#7a9080",

    fontStyle: "italic",

  },



  catalogWrap: { padding: "48px 8% 64px" },

  grid: {

    display: "grid",

    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",

    gap: "24px",

  },



  ctaBanner: {

    background: "linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 100%)",

    padding: "60px 8%",

    margin: "0",

  },

  ctaInner: {

    display: "flex", alignItems: "center", justifyContent: "space-between",

    gap: "32px", flexWrap: "wrap", maxWidth: "1200px", margin: "0 auto",

  },

  ctaLeft: { flex: 1, minWidth: "280px" },

  ctaEye: {

    fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase",

    color: "#b8a070", marginBottom: "10px",

  },

  ctaTitle: {

    fontFamily: "Georgia, serif", fontSize: "clamp(1.5rem,3vw,2.2rem)",

    color: "#f9faf8", fontWeight: "300", margin: "0 0 12px",

  },

  ctaSub: { fontSize: "0.9rem", color: "#c8dfd1", lineHeight: "1.75", maxWidth: "500px" },

  ctaBtn: {

    background: "linear-gradient(135deg, #b8a070, #d4bc8a)",

    color: "#1a3a2a", padding: "14px 32px", border: "none",

    fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px",

    textTransform: "uppercase", cursor: "pointer", borderRadius: "2px",

    flexShrink: 0, boxShadow: "0 4px 20px rgba(184,160,112,0.3)",

    transition: "all 0.2s",

  },

};



// Cards

const c = {

  card: {

    background: "#fff",

    borderRadius: "6px",

    overflow: "hidden",

    boxShadow: "0 4px 20px rgba(26,58,42,0.07)",

    border: "1px solid rgba(74,138,94,0.1)",

    transition: "transform 0.35s ease, box-shadow 0.35s ease",

    display: "flex", flexDirection: "column",

  },

  cardHover: {

    transform: "translateY(-6px)",

    boxShadow: "0 20px 50px rgba(26,58,42,0.15)",

  },

  imgWrap: { position: "relative", height: "240px", overflow: "hidden", flexShrink: 0 },

  img: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" },

  imgGrad: {

    position: "absolute", inset: 0,

    background: "linear-gradient(to top, rgba(26,58,42,0.7) 0%, transparent 60%)",

    transition: "opacity 0.4s",

  },

  tag: {

    position: "absolute", top: "14px", left: "14px",

    fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase",

    fontWeight: "600", padding: "4px 10px", borderRadius: "2px",

  },

  category: {

    position: "absolute", top: "14px", right: "14px",

    fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase",

    color: "rgba(255,255,255,0.7)", fontWeight: "500",

    background: "rgba(0,0,0,0.35)", padding: "4px 10px", borderRadius: "2px",

    backdropFilter: "blur(4px)",

  },

  outOfStock: {

    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,

    background: "rgba(26,58,42,0.5)", display: "flex",

    alignItems: "center", justifyContent: "center",

    fontSize: "12px", letterSpacing: "2px", color: "#d4bc8a",

    fontWeight: "700", textTransform: "uppercase",

  },

  hoverCta: {

    position: "absolute", bottom: "14px", left: "14px", right: "14px",

    transition: "opacity 0.3s, transform 0.3s",

  },

  hoverDetail: {

    width: "100%", padding: "10px",

    background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",

    border: "1px solid rgba(255,255,255,0.3)",

    color: "#fff", fontSize: "12px", letterSpacing: "1px",

    textTransform: "uppercase", cursor: "pointer", borderRadius: "2px",

    fontWeight: "600",

  },

  content: { padding: "20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 },

  origin: {

    fontSize: "10px", color: "#7a9080", letterSpacing: "0.5px",

    display: "flex", alignItems: "center",

  },

  name: {

    fontFamily: "Georgia, 'Times New Roman', serif",

    fontSize: "1.35rem", fontWeight: "400", color: "#1a3a2a",

    lineHeight: "1.25", margin: 0,

  },

  desc: { fontSize: "12.5px", color: "#7a9080", lineHeight: "1.7", margin: 0 },

  qualityWrap: {

    background: "#f4f0e8", borderRadius: "4px", padding: "12px",

    marginTop: "4px",

  },

  qualityLabel: {

    fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase",

    color: "#7a9080", fontWeight: "600", marginBottom: "8px",

  },

  gradeGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "4px" },

  gradeBtn: {

    fontSize: "9px", letterSpacing: "0.3px", padding: "5px 4px",

    border: "1px solid rgba(74,138,94,0.2)", background: "#fff",

    cursor: "pointer", borderRadius: "2px", color: "#7a9080",

    textAlign: "center", transition: "all 0.2s", lineHeight: "1.2",

  },

  gradeBtnActive: {

    background: "#1a3a2a", color: "#d4bc8a", borderColor: "#1a3a2a",

  },

  footer: {

    display: "flex", alignItems: "center", justifyContent: "space-between",

    marginTop: "auto", paddingTop: "12px",

    borderTop: "1px solid rgba(74,138,94,0.1)",

  },

  priceWrap: { display: "flex", alignItems: "baseline", gap: "3px" },

  priceLabel: { fontSize: "10px", color: "#7a9080" },

  price: { fontFamily: "Georgia, serif", fontSize: "1.4rem", color: "#2d5a3d", fontWeight: "400" },

  priceUnit: { fontSize: "11px", color: "#7a9080" },

  actions: { display: "flex", gap: "6px" },

  btnDetail: {

    display: "flex", alignItems: "center", gap: "4px",

    fontSize: "11px", letterSpacing: "0.5px", padding: "8px 12px",

    border: "1px solid rgba(74,138,94,0.25)", background: "transparent",

    cursor: "pointer", borderRadius: "2px", color: "#3d5044",

    fontWeight: "500", transition: "all 0.2s",

  },

  btnQuote: {

    fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase",

    padding: "8px 14px", background: "#b8a070", border: "none",

    color: "#1a3a2a", cursor: "pointer", borderRadius: "2px",

    fontWeight: "700", transition: "all 0.2s",

  },

};



// Quote Modal

const m = {

  overlay: {

    position: "fixed", inset: 0, background: "rgba(15,35,24,0.7)",

    backdropFilter: "blur(4px)", zIndex: 200,

    display: "flex", alignItems: "center", justifyContent: "center",

    padding: "16px",

  },

  modal: {

    background: "linear-gradient(180deg, #1a3a2a 0%, #0f2318 100%)",

    border: "1px solid rgba(74,138,94,0.3)",

    borderRadius: "6px", width: "100%", maxWidth: "520px",

    maxHeight: "90vh", overflowY: "auto",

    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",

  },

  modalHeader: {

    display: "flex", justifyContent: "space-between", alignItems: "flex-start",

    padding: "24px 24px 16px",

    borderBottom: "1px solid rgba(74,138,94,0.2)",

  },

  modalEye: {

    fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase",

    color: "#b8a070", marginBottom: "4px",

  },

  modalTitle: {

    fontFamily: "Georgia, serif", fontSize: "1.3rem",

    color: "#f9faf8", fontWeight: "400",

  },

  closeBtn: {

    background: "none", border: "none", color: "#7a9080",

    fontSize: "16px", cursor: "pointer", padding: "4px",

    lineHeight: 1,

  },

  productRow: {

    display: "flex", gap: "16px", padding: "16px 24px",

    alignItems: "center",

    borderBottom: "1px solid rgba(74,138,94,0.15)",

  },

  productThumb: {

    width: "72px", height: "72px", objectFit: "cover",

    borderRadius: "3px", flexShrink: 0,

  },

  productInfo: {},

  livePrice: { display: "flex", alignItems: "baseline", gap: "4px" },

  livePriceVal: {

    fontFamily: "Georgia, serif", fontSize: "1.8rem",

    color: "#d4bc8a", fontWeight: "400", lineHeight: 1,

  },

  livePriceUnit: { fontSize: "12px", color: "#7a9080" },

  liveTotal: { fontSize: "12px", color: "#c8dfd1", marginTop: "4px" },

  liveMeta: { fontSize: "10px", color: "#4a6a54", marginTop: "3px" },

  fieldGroup: { padding: "16px 24px" },

  label: {

    display: "block", fontSize: "10px", letterSpacing: "1.5px",

    textTransform: "uppercase", color: "#c8dfd1", fontWeight: "600",

    marginBottom: "10px",

  },

  gradeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" },

  gradeBtn: {

    padding: "10px 12px", border: "1px solid rgba(74,138,94,0.25)",

    background: "rgba(255,255,255,0.04)", cursor: "pointer", borderRadius: "3px",

    transition: "all 0.2s", textAlign: "left",

  },

  gradeBtnActive: {

    border: "1px solid rgba(184,160,112,0.6)",

    background: "rgba(184,160,112,0.1)",

  },

  gradeName: { display: "block", fontSize: "12px", color: "#c8dfd1", fontWeight: "500" },

  gradePrice: { display: "block", fontSize: "11px", color: "#d4bc8a", marginTop: "2px" },

  slider: { width: "100%", accentColor: "#b8a070", display: "block" },

  sliderLabels: {

    display: "flex", justifyContent: "space-between",

    fontSize: "10px", color: "#4a6a54", marginTop: "4px",

  },

  qtyDisplay: {

    fontFamily: "Georgia, serif", fontSize: "1rem", color: "#d4bc8a",

  },

  contactGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" },

  input: {

    padding: "10px 12px",

    background: "rgba(255,255,255,0.05)",

    border: "1px solid rgba(74,138,94,0.25)",

    borderRadius: "3px", color: "#f9faf8", fontSize: "13px",

    outline: "none", width: "100%", boxSizing: "border-box",

    fontFamily: "inherit",

  },

  sendBtn: {

    width: "calc(100% - 48px)", margin: "0 24px 24px",

    padding: "13px",

    background: "linear-gradient(135deg, #b8a070, #d4bc8a)",

    color: "#1a3a2a", border: "none", borderRadius: "2px",

    fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px",

    textTransform: "uppercase", cursor: "pointer",

  },

  successBox: {

    padding: "48px 32px", textAlign: "center",

    display: "flex", flexDirection: "column", alignItems: "center",

  },

  successIcon: { marginBottom: "20px" },

  successTitle: {

    fontFamily: "Georgia, serif", fontSize: "1.5rem",

    color: "#f9faf8", marginBottom: "12px",

  },

  successText: {

    fontSize: "14px", color: "#c8dfd1", lineHeight: "1.7",

    marginBottom: "24px",

  },

  successClose: {

    padding: "10px 28px",

    background: "linear-gradient(135deg, #b8a070, #d4bc8a)",

    color: "#1a3a2a", border: "none", borderRadius: "2px",

    fontSize: "12px", fontWeight: "700", letterSpacing: "1px",

    textTransform: "uppercase", cursor: "pointer",

  },

};



// Detail Drawer

const d = {

  overlay: {

    position: "fixed", inset: 0,

    background: "rgba(10,24,15,0.75)", backdropFilter: "blur(4px)",

    zIndex: 200, display: "flex", justifyContent: "flex-end",

  },

  drawer: {

    width: "100%", maxWidth: "480px", height: "100%",

    background: "linear-gradient(180deg, #1a3a2a 0%, #0f2318 100%)",

    overflowY: "auto", display: "flex", flexDirection: "column",

    boxShadow: "-20px 0 60px rgba(0,0,0,0.4)",

    border: "none",

  },

  imgWrap: { position: "relative", height: "260px", flexShrink: 0 },

  img: { width: "100%", height: "100%", objectFit: "cover" },

  imgOverlay: {

    position: "absolute", inset: 0,

    background: "linear-gradient(to top, rgba(15,35,24,1) 0%, rgba(15,35,24,0.3) 60%, transparent 100%)",

  },

  closeBtn: {

    position: "absolute", top: "16px", right: "16px",

    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",

    border: "1px solid rgba(255,255,255,0.2)",

    color: "#fff", fontSize: "14px", cursor: "pointer",

    width: "32px", height: "32px", borderRadius: "50%",

    display: "flex", alignItems: "center", justifyContent: "center",

  },

  imgMeta: {

    position: "absolute", bottom: "20px", left: "20px", right: "20px",

  },

  tag: {

    display: "inline-block", fontSize: "9px", letterSpacing: "1.5px",

    textTransform: "uppercase", fontWeight: "700",

    padding: "3px 8px", borderRadius: "2px", border: "1px solid",

    marginBottom: "8px",

  },

  imgTitle: {

    fontFamily: "Georgia, serif", fontSize: "1.6rem",

    color: "#f9faf8", fontWeight: "400", margin: "0 0 6px",

  },

  imgOrigin: {

    fontSize: "11px", color: "#c8dfd1", display: "flex",

    alignItems: "center", gap: "5px",

  },

  tabs: {

    display: "flex", borderBottom: "1px solid rgba(74,138,94,0.2)",

    flexShrink: 0,

  },

  tab: {

    flex: 1, padding: "14px 8px", background: "none", border: "none",

    fontSize: "11px", letterSpacing: "0.5px", color: "#7a9080",

    cursor: "pointer", fontWeight: "500", textTransform: "capitalize",

    borderBottom: "2px solid transparent",

    transition: "all 0.2s",

  },

  tabActive: {

    color: "#d4bc8a", borderBottom: "2px solid #d4bc8a",

  },

  body: { padding: "24px 24px", flex: 1, overflowY: "auto" },

  longDesc: {

    fontSize: "13.5px", color: "#c8dfd1", lineHeight: "1.8",

    marginBottom: "20px",

  },

  metaRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" },

  metaItem: {

    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(74,138,94,0.2)",

    borderRadius: "3px", padding: "12px",

  },

  metaLabel: {

    display: "block", fontSize: "9px", letterSpacing: "1px",

    textTransform: "uppercase", color: "#7a9080", marginBottom: "4px",

  },

  metaVal: { fontSize: "12px", color: "#f9faf8", fontWeight: "600" },

  specsGrid: { display: "flex", flexDirection: "column", gap: "0" },

  specRow: {

    display: "flex", justifyContent: "space-between", alignItems: "center",

    padding: "12px 0", borderBottom: "1px solid rgba(74,138,94,0.12)",

  },

  specKey: { fontSize: "12px", color: "#7a9080" },

  specVal: { fontSize: "12px", color: "#c8dfd1", fontWeight: "500", textAlign: "right", maxWidth: "55%" },

  appIntro: { fontSize: "13px", color: "#c8dfd1", marginBottom: "14px" },

  appGrid: {

    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px",

  },

  appTag: {

    background: "rgba(74,138,94,0.1)", border: "1px solid rgba(74,138,94,0.2)",

    borderRadius: "3px", padding: "10px 12px",

    fontSize: "12px", color: "#c8dfd1",

    display: "flex", alignItems: "center", gap: "8px",

  },

  appDot: { color: "#b8a070", fontSize: "8px" },

  pricingGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" },

  priceCard: {

    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(74,138,94,0.2)",

    borderRadius: "3px", padding: "16px",

    cursor: "pointer", transition: "all 0.2s",

  },

  priceCardActive: {

    border: "1px solid rgba(184,160,112,0.5)",

    background: "rgba(184,160,112,0.08)",

  },

  pGrade: { fontSize: "11px", color: "#7a9080", marginBottom: "6px" },

  pPrice: {

    fontFamily: "Georgia, serif", fontSize: "1.4rem",

    color: "#d4bc8a", fontWeight: "400",

  },

  pUnit: { fontSize: "10px", color: "#4a6a54", marginTop: "2px" },

  priceNote: {

    fontSize: "10.5px", color: "#4a6a54", lineHeight: "1.6",

    borderLeft: "2px solid rgba(184,160,112,0.3)", paddingLeft: "10px",

  },

  footer: {

    padding: "16px 24px",

    borderTop: "1px solid rgba(74,138,94,0.2)",

    flexShrink: 0,

  },

  quoteBtn: {

    width: "100%", padding: "14px",

    background: "linear-gradient(135deg, #b8a070, #d4bc8a)",

    color: "#1a3a2a", border: "none", borderRadius: "2px",

    fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px",

    textTransform: "uppercase", cursor: "pointer",

  },

};

