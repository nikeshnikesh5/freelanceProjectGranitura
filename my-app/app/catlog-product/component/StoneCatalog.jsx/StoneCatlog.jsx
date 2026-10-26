
"use client";

import { useState, useEffect, useRef } from "react";
import PRODUCTS from "../../data/db.json";
import { Application, Graphics } from "pixi.js";

// Keep your existing PixiStoneCanvas, ProductCard,
// QuoteModal, DetailDrawer, SpecialistScheduler,
// CATEGORIES, and p style definitions in this file.

export default function StoneCatalog() {
  const ITEMS_PER_PAGE = 12;

  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("granite",);
  const [quoteProduct, setQuoteProduct] = useState(null)
  const [detailProduct, setDetailProduct] = useState(null);
  const [openScheduler, setOpenScheduler] = useState(false);

  // Filter products
  const filtered = PRODUCTS.filter((product) => {
    if (activeFilter === "All") return true;

    return (
      String(product.category || "").toLowerCase() ===
      activeFilter.toLowerCase()
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedProducts = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to page one when the filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Prevent body scrolling while a modal or drawer is open
  useEffect(() => {
    const modalIsOpen = Boolean(quoteProduct || detailProduct);

    document.body.style.overflow = modalIsOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [quoteProduct, detailProduct]);

  return (
    <div style={p.page}>
      <style>{`
        @media (max-width: 1350px) {
          .granitura-stone-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 1050px) {
          .granitura-stone-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 720px) {
          .granitura-stone-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 460px) {
          .granitura-stone-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Pagination container */
        .granitura-pagination {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          margin: 42px 0 24px;
          padding: 24px 0;
          border-top: 1px solid #e5e0d5;
        }

        .granitura-pagination-info {
          margin: 0;
          color: #77766f;
          font-size: 13px;
          text-align: center;
        }

        .granitura-pagination-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .granitura-page-number,
        .granitura-page-arrow {
          min-width: 42px;
          height: 42px;
          padding: 0 12px;
          border: 1px solid #ded9ce;
          border-radius: 4px;
          background: #fff;
          color: #263b2d;
          font-size: 13px;
          cursor: pointer;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
        }

        .granitura-page-number:hover:not(.active),
        .granitura-page-arrow:hover:not(:disabled) {
          border-color: #263b2d;
          background: #f4f3ed;
        }

        .granitura-page-number.active {
          border-color: #263b2d;
          background: #263b2d;
          color: #fff;
        }

        .granitura-page-arrow:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .granitura-page-number:focus-visible,
        .granitura-page-arrow:focus-visible {
          outline: 2px solid #b89a61;
          outline-offset: 3px;
        }

        @media (max-width: 460px) {
          .granitura-pagination {
            margin-top: 28px;
          }

          .granitura-pagination-controls {
            gap: 5px;
          }

          .granitura-page-number,
          .granitura-page-arrow {
            min-width: 36px;
            height: 38px;
            padding: 0 8px;
            font-size: 12px;
          }
        }
      `}</style>

      {/* HERO */}
      <div style={p.hero}>
        <PixiStoneCanvas />

        <div style={p.heroInner}>
          <div style={p.heroEye}>Premium Collection — Est. 2008</div>

          <h1 style={p.heroTitle}>
            Indian Granite
            <br />
            <em style={p.heroTitleEm}>Collection</em>
          </h1>

          <div style={p.heroRule} />

          <p style={p.heroSub}>
            Explore distinctive Indian granite selected for architectural,
            hospitality and commercial projects across the Middle East.
            Request export-ready specifications and a tailored quotation.
          </p>

          <div style={p.heroStats}>
            {[
              ["India", "Quarry Sourcing"],
              ["Bulk", "Project Supply"],
              ["Custom", "Finishes & Sizes"],
              ["GCC", "Export Enquiries"],
            ].map(([num, label]) => (
              <div key={label} style={p.heroStat}>
                <div style={p.heroStatNum}>{num}</div>
                <div style={p.heroStatLabel}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div style={p.filterBar}>
        <div style={p.filterInner}>
          <div style={p.filterLabel}>Filter by type</div>

          <div style={p.filterBtns}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                style={{
                  ...p.filterBtn,
                  ...(activeFilter === cat ? p.filterBtnActive : {}),
                }}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}

                {cat !== "All" && (
                  <span style={p.filterCount}>
                    {
                      PRODUCTS.filter(
                        (product) =>
                          String(product.category || "").toLowerCase() ===
                          cat.toLowerCase()
                      ).length
                    }
                  </span>
                )}
              </button>
            ))}
          </div>

          <div style={p.resultCount}>
            {filtered.length} products
          </div>
        </div>
      </div>

      {/* PRODUCT GRID AND PAGINATION */}
      <div style={p.catalogWrap}>
        <div className="granitura-stone-grid" style={p.grid}>
          {paginatedProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={startIndex + i}
              onQuote={setQuoteProduct}
              onDetail={setDetailProduct}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px 0" }}>
            No products found in this category.
          </p>
        ) : totalPages > 1 ? (
          <nav
            className="granitura-pagination"
            aria-label="Product pagination"
          >
            <p className="granitura-pagination-info">
              Showing {startIndex + 1}–
              {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} products
            </p>

            <div className="granitura-pagination-controls">
              <button
                type="button"
                className="granitura-page-arrow"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                ← Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`granitura-page-number ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => goToPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={
                    currentPage === page ? "page" : undefined
                  }
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className="granitura-page-arrow"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next →
              </button>
            </div>
          </nav>
        ) : null}
      </div>

      {/* CTA BANNER */}
      <div style={p.ctaBanner}>
        <div style={p.ctaInner}>
          <div style={p.ctaLeft}>
            <div style={p.ctaEye}>Custom Requirements?</div>

            <h2 style={p.ctaTitle}>
              Need a bespoke stone solution?
            </h2>

            <p style={p.ctaSub}>
              Our specialists handle custom cutting, bookmatched panels,
              and bulk procurement for projects of any scale — from single
              apartments to landmark towers.
            </p>
          </div>

          <button
            type="button"
            style={p.ctaBtn}
            onClick={() => setOpenScheduler(true)}
          >
            Talk to a Specialist →
          </button>

          <SpecialistScheduler
            isOpen={openScheduler}
            onClose={() => setOpenScheduler(false)}
            onConfirm={(booking) =>
              console.info("Consultation request:", booking)
            }
          />
        </div>
      </div>

      {/* MODALS */}
      {quoteProduct && (
        <QuoteModal
          product={quoteProduct}
          onClose={() => setQuoteProduct(null)}
        />
      )}

      {detailProduct && (
        <DetailDrawer
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onQuote={(product) => {
            setDetailProduct(null);
            setQuoteProduct(product);
          }}
        />
      )}
    </div>
  );
}
