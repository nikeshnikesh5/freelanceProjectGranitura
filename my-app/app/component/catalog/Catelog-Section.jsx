

// "use client";

// import "./catlog.css";
// import Link from "next/link";

// const catalogItems = [
//   {
//     id: 1,
//     name: "Carrara Bianco",
//     category:"granite",
//     tag: "Italian Import",
//     image: "/assets/catlog/luxurious-marble-texture-background.jpg",
//     desc: "Quarried from the Apuan Alps — pure white with subtle grey veining.",
//   },
//   {
//     id: 2,
//     name: "Verde Guatemala",
//     category:"granite",
//     tag: "Italian Import",
//     image: "/assets/catlog/ItalianGranite.jpg",
//     desc: "Deep emerald tones with luxurious natural veining.",
//   },
//   {
//     id: 3,
//     name: "Absolute Black",
//     category: "granite",
//     tag: "Premium Granite",
//     image: "/assets/catlog/Granite.jpg",
//     desc: "Premium jet-black granite for luxury flooring and countertops.",
//   },
//   {
//     id: 4,
//     name: "Cuddapah Black",
//     category: "stone",
//     tag: "Bangalore Stone",
//     image: "/assets/catlog/bangloreStone.jpg",
//     desc: "Durable and timeless natural stone for indoor and outdoor use.",
//   },
//   {
//     id: 5,
//     name: "Kota Blue",
//     category: "stone",
//     tag: "Kota Stone",
//     image: "/assets/catlog/KotaBlackStone.jpg",
//     desc: "Blue-grey limestone famous for strength and longevity.",
//   },
//   {
//     id: 6,
//     name: "Crema Marfil",
//     category:"granite",
//     tag: "Italian Import",
//     image: "/assets/catlog/luxurious-marble-texture-background.jpg",
//     desc: "Warm ivory marble delivering timeless elegance and luxury.",
//   },
// ];

// export default function CatalogSection() {
//   return (
//     <section id="catalog">
//       <div className="catalog-header">
//         <div>
//           <p className="section-eyebrow reveal">
//             Stone Collection
//           </p>

//           <h2 className="section-title reveal">
//             Our <em>Finest</em> Materials
//           </h2>
//         </div>

//         <div className="catalog-filter">
//           <button className="filter-btn active" data-filter="all">
//             All
//           </button>

//           <button className="filter-btn" data-filter="marble">
//             Marble
//           </button>

//           <button className="filter-btn" data-filter="granite">
//             Granite
//           </button>

//           <button className="filter-btn" data-filter="stone">
//             Stone
//           </button>
//         </div>
//       </div>

//       <div className="catalog-grid">
//         {catalogItems.map((item) => (
//           <div
//             key={item.id}
//             className="product-card"
//             data-cat={item.category}
//           >
//             <div className="card-bg">
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="card-image"
//               />
//             </div>

//             <span className="card-tag">{item.tag}</span>

//             <div className="card-overlay">
//               <div className="card-name">{item.name}</div>

//               <div className="card-desc">
//                 {item.desc}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div
//         style={{
//           textAlign: "center",
//           marginTop: "4rem",
//         }}
//       >
//         <Link href="/catlog-product" className="btn-primary">
//           View Full Catalog →
//         </Link>
//       </div>
//     </section>
//   );
// }









"use client";

import "./catlog.css";
import Link from "next/link";
import { useEffect, useRef } from "react";

const catalogItems = [
  {
    id: 1,
    name: "Carrara Bianco",
    category:"granite",
    tag: "Italian Import",
    image: "/assets/catlog/luxurious-marble-texture-background.jpg",
    desc: "Quarried from the Apuan Alps — pure white with subtle grey veining.",
  },
  {
    id: 2,
    name: "Verde Guatemala",
    category:"granite",
    tag: "Italian Import",
    image: "/assets/catlog/ItalianGranite.jpg",
    desc: "Deep emerald tones with luxurious natural veining.",
  },
  {
    id: 3,
    name: "Absolute Black",
    category: "granite",
    tag: "Premium Granite",
    image: "/assets/catlog/Granite.jpg",
    desc: "Premium jet-black granite for luxury flooring and countertops.",
  },
  {
    id: 4,
    name: "Cuddapah Black",
    category: "stone",
    tag: "Bangalore Stone",
    image: "/assets/catlog/bangloreStone.jpg",
    desc: "Durable and timeless natural stone for indoor and outdoor use.",
  },
  {
    id: 5,
    name: "Kota Blue",
    category: "stone",
    tag: "Kota Stone",
    image: "/assets/catlog/KotaBlackStone.jpg",
    desc: "Blue-grey limestone famous for strength and longevity.",
  },
  {
    id: 6,
    name: "Crema Marfil",
    category:"granite",
    tag: "Italian Import",
    image: "/assets/catlog/luxurious-marble-texture-background.jpg",
    desc: "Warm ivory marble delivering timeless elegance and luxury.",
  },
];

export default function CatalogSection() {
  const gridRef = useRef(null);

  // One-time arrow "nudge" when a card scrolls into view
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".product-card");
    if (!cards || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("nudge");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    cards.forEach((card) => io.observe(card));
    return () => io.disconnect();
  }, []);

  return (
    <section id="catalog">
      <div className="catalog-header">
        <div>
          <p className="section-eyebrow reveal">Stone Collection</p>
          <h2 className="section-title reveal">
            Our <em>Finest</em> Materials
          </h2>
        </div>

        {/* <div className="catalog-filter">
          <button className="filter-btn active" data-filter="all">All</button>
          <button className="filter-btn" data-filter="marble">Marble</button>
          <button className="filter-btn" data-filter="granite">Granite</button>
          <button className="filter-btn" data-filter="stone">Stone</button>
        </div> */}
      </div>

      <div className="catalog-grid" ref={gridRef}>
        {catalogItems.map((item, index) => (
          <Link
            key={item.id}
            href={`/catlog-product?category=${item.category}`}
            className="product-card"
            data-cat={item.category}
            aria-label={`Explore ${item.name}`}
            style={{ "--i": index }}
          >
            <div className="card-bg">
              <img src={item.image} alt={item.name} className="card-image" />
            </div>
            <span className="card-tag">{item.tag}</span>
            <div className="card-overlay">
              <div className="card-name">{item.name}</div>
              <div className="card-desc">{item.desc}</div>
            </div>

            {/* Click hint */}
            <span className="card-cta" aria-hidden="true">
              <span className="card-cta-label">Explore</span>
              <svg
                className="card-cta-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <Link href="/catlog-product" className="btn-primary">
          View Full Catalog →
        </Link>
      </div>
    </section>
  );
}
