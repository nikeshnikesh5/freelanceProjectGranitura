
"use client";

import "./catlog.css";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Application, Container, Graphics } from "pixi.js";
import PRODUCTS from "../../../data/db.json";

const DISPLAYED_IDS = [2, 3, 4, 5];
const PARTICLE_COUNT = 42;

export default function CatalogSection() {
  const sectionRef = useRef(null);
  const pixiRef = useRef(null);

  const catalogItems = PRODUCTS.filter((item) =>
    DISPLAYED_IDS.includes(Number(item.id))
  );

  // PixiJS interactive particle background.
  useEffect(() => {
    const section = sectionRef.current;
    const host = pixiRef.current;

    if (!section || !host) return;

    let app;
    let disposed = false;
    let resizeObserver;

    const pointer = { x: -1000, y: -1000 };
    const particles = [];
    const lines = new Graphics();

    const handlePointerMove = (event) => {
      const rect = section.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerleave", handlePointerLeave);

    async function setupPixi() {
      const instance = new Application();

      await instance.init({
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        resizeTo: section,
      });

      if (disposed) {
        instance.destroy(true);
        return;
      }

      app = instance;
      app.canvas.classList.add("catalog-pixi-canvas");
      host.appendChild(app.canvas);

      const layer = new Container();
      app.stage.addChild(lines, layer);

      const width = section.clientWidth;
      const height = section.clientHeight;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const radius = Math.random() * 1.8 + 0.8;
        const dot = new Graphics()
          .circle(0, 0, radius)
          .fill({ color: 0xd8b56d, alpha: 0.8 });

        const particle = {
          graphic: dot,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius,
        };

        dot.position.set(particle.x, particle.y);
        particles.push(particle);
        layer.addChild(dot);
      }

      app.ticker.add((ticker) => {
        if (disposed) return;

        const dt = Math.min(ticker.deltaTime, 2);
        const w = section.clientWidth;
        const h = section.clientHeight;

        lines.clear();

        particles.forEach((p) => {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const distance = Math.hypot(dx, dy);

          // Gentle repulsion from the mouse.
          if (distance < 115 && distance > 0) {
            const force = ((115 - distance) / 115) * 0.65;
            p.vx -= (dx / distance) * force * 0.035;
            p.vy -= (dy / distance) * force * 0.035;
          }

          p.vx += (Math.random() - 0.5) * 0.008;
          p.vy += (Math.random() - 0.5) * 0.008;

          p.vx *= 0.995;
          p.vy *= 0.995;

          const maxSpeed = 0.65;
          const speed = Math.hypot(p.vx, p.vy);

          if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
          }

          p.x += p.vx * dt;
          p.y += p.vy * dt;

          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;

          p.graphic.position.set(p.x, p.y);
          p.graphic.alpha = distance < 115 ? 0.95 : 0.55;
        });

        // Fine gold connections between nearby particles.
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);

            if (distance < 105) {
              lines
                .moveTo(a.x, a.y)
                .lineTo(b.x, b.y)
                .stroke({
                  color: 0xbda16b,
                  alpha: (1 - distance / 105) * 0.23,
                  width: 0.7,
                });
            }
          }
        }
      });

      resizeObserver = new ResizeObserver(() => {
        if (app && !disposed) {
          app.renderer.resize(
            section.clientWidth,
            section.clientHeight
          );
        }
      });

      resizeObserver.observe(section);
    }

    setupPixi().catch((error) => {
      if (!disposed) console.error("PixiJS setup failed:", error);
    });

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);

      if (app) {
        app.destroy(true, { children: true });
      }
    };
  }, []);

  // Animate product cards once when they enter the viewport.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) return;

    const cards = section.querySelectorAll(".product-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("nudge");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="catalog" className="catalog-section" ref={sectionRef}>
      <div className="catalog-pixi-layer" ref={pixiRef} aria-hidden="true" />

      <div className="catalog-shell">
        <header className="catalog-header">
          <div className="catalog-heading">
            <p className="section-eyebrow">
              <span className="eyebrow-line" />
              The Granitura Collection
            </p>

            <h2 className="section-title">
              Natural Beauty.
              <br />
              <em>Exceptional Stone.</em>
            </h2>

            <p className="catalog-intro">
              Discover timeless textures, distinctive patterns, and
              carefully selected stone for spaces that stand apart.
            </p>
          </div>

          <div className="catalog-count">
            <span>0{catalogItems.length}</span>
            <small>Featured collections</small>
          </div>
        </header>

        <div className="catalog-grid">
          {catalogItems.map((item, index) => (
            <Link
              key={item.id}
              href={`/catlog-product?category=${encodeURIComponent(
                item.category || ""
              )}`}
              className={`product-card product-card-${index + 1}`}
              data-cat={item.category}
              aria-label={`Explore ${item.name}`}
              style={{ "--i": index }}
            >
              <div className="card-bg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="card-image"
                  loading="lazy"
                />
                <div className="card-shade" />
              </div>

              <div className="card-topline">
                <span className="card-tag">{item.tag}</span>
                <span className="card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="card-overlay">
                <div className="card-category">{item.category}</div>
                <h3 className="card-name">{item.name}</h3>
                <p className="card-desc">{item.desc}</p>

                <span className="card-cta">
                  <span className="card-cta-label">Explore collection</span>
                  <span className="card-cta-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </div>
            </Link>
          ))}

          {catalogItems.length === 0 && (
            <p className="catalog-empty">
              No featured products are available yet.
            </p>
          )}
        </div>

        <div className="catalog-footer">
          <p>Find the right stone for your next space.</p>
          <Link href="/catlog-product" className="btn-primary">
            View Full Collection
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
