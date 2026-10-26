
"use client";

import { useEffect, useRef, useState } from "react";
import { Application, Container, Graphics } from "pixi.js";
import "./ExportJourneyHero.css";

const stones = [
  { name: "Black Galaxy", type: "PREMIUM GRANITE", image: "/assets/Granites.jpg", finish: "Polished" },
  { name: "Imperial White", type: "LIGHT GRANITE", image: "/assets/ItalianMarbles.jpg", finish: "Polished / Honed" },
  { name: "Tan Brown", type: "WARM GRANITE", image: "/assets/BangloreStone.jpg", finish: "Polished / Flamed" },
  { name: "Steel Grey", type: "ARCHITECTURAL GRANITE", image: "/assets/KotaBlackStone.jpg", finish: "Honed / Flamed" },
];

export default function ExportJourneyHero() {
  const hostRef = useRef(null);
  const [selected, setSelected] = useState(0);
  const [journey, setJourney] = useState(false);
  const stone = stones[selected];

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let app;
    let observer;
    let disposed = false;

    async function start() {
      app = new Application();
      await app.init({
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        resizeTo: host,
      });

      if (disposed) {
        app.destroy(true, { children: true });
        return;
      }

      host.appendChild(app.canvas);

      const scene = new Container();
      app.stage.addChild(scene);

      const route = new Graphics();
      const routeGlow = new Graphics();
      const dots = new Graphics();
      const particles = [];
      const ship = new Graphics();
      const indiaPoint = new Graphics();
      const destinationPoint = new Graphics();

      scene.addChild(routeGlow, route, dots, indiaPoint, destinationPoint, ship);

      for (let i = 0; i < 38; i++) {
        const particle = new Graphics()
          .circle(0, 0, 1 + Math.random() * 1.8)
          .fill({ color: 0xe7bd7d, alpha: 0.2 + Math.random() * 0.5 });

        particle.x = Math.random() * 1000;
        particle.y = Math.random() * 700;
        particle.v = 0.15 + Math.random() * 0.5;
        particle.phase = Math.random() * Math.PI * 2;
        scene.addChild(particle);
        particles.push(particle);
      }

      function draw() {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;

        // A stylised India-to-Middle-East shipping arc.
        const startX = w * 0.48;
        const startY = h * 0.38;
        const endX = w * 0.88;
        const endY = h * 0.47;
        const controlX = w * 0.67;
        const controlY = h * 0.05;

        route.clear();
        routeGlow.clear();
        dots.clear();

        routeGlow.moveTo(startX, startY)
          .quadraticCurveTo(controlX, controlY, endX, endY)
          .stroke({ color: 0xe3ad68, width: 8, alpha: 0.09 });

        route.moveTo(startX, startY)
          .quadraticCurveTo(controlX, controlY, endX, endY)
          .stroke({ color: 0xf2c98d, width: 1.6, alpha: 0.9 });

        dots.circle(startX, startY, 4).fill(0xffd99b);
        dots.circle(endX, endY, 4).fill(0xffd99b);

        indiaPoint.clear();
        indiaPoint.circle(startX, startY, 10)
          .stroke({ color: 0xe9bc7b, width: 1, alpha: 0.65 });
        indiaPoint.circle(startX, startY, 2.5).fill(0xffe0a6);

        destinationPoint.clear();
        destinationPoint.circle(endX, endY, 10)
          .stroke({ color: 0xe9bc7b, width: 1, alpha: 0.65 });
        destinationPoint.circle(endX, endY, 2.5).fill(0xffe0a6);
      }

      function onResize() {
        draw();
        particles.forEach((p) => {
          p.x = Math.min(p.x, host.clientWidth);
          p.y = Math.min(p.y, host.clientHeight);
        });
      }

      let time = 0;
      const animate = (ticker) => {
        time += ticker.deltaTime * 0.008;

        const w = host.clientWidth;
        const h = host.clientHeight;

        particles.forEach((p) => {
          p.y -= p.v * ticker.deltaTime;
          p.alpha = 0.25 + (Math.sin(time + p.phase) + 1) * 0.25;

          if (p.y < 0) {
            p.y = h;
            p.x = Math.random() * w;
          }
        });

        // Moving ship marker travels along the curved route.
        const t = (time * 0.055) % 1;
        const sx = w * 0.48;
        const sy = h * 0.38;
        const ex = w * 0.88;
        const ey = h * 0.47;
        const cx = w * 0.67;
        const cy = h * 0.05;

        const x = (1 - t) ** 2 * sx + 2 * (1 - t) * t * cx + t ** 2 * ex;
        const y = (1 - t) ** 2 * sy + 2 * (1 - t) * t * cy + t ** 2 * ey;

        ship.clear();
        ship.moveTo(-9, -5)
          .lineTo(10, -5)
          .lineTo(6, 2)
          .lineTo(-5, 2)
          .closePath()
          .fill({ color: 0xffd08a });

        ship.position.set(x, y);
        ship.rotation = -0.08;
      };

      app.ticker.add(animate);
      observer = new ResizeObserver(onResize);
      observer.observe(host);
      draw();
    }

    start().catch((error) => {
      console.error("Could not start the PixiJS export scene:", error);
    });

    return () => {
      disposed = true;
      observer?.disconnect();
      if (app) app.destroy(true, { children: true });
    };
  }, []);

  return (
    <main className="journey-hero">
      <div className="journey-map" ref={hostRef} aria-hidden="true" />

      <header className="journey-nav">
        <a className="journey-logo" href="/">
          <span className="logo-symbol">⌁</span>
          <span>GRANITURA</span>
          <small>NATURAL STONE WORLDWIDE</small>
        </a>

        <nav>
          <a href="/">Home</a>
          <a href="/catlog-product">Stone Collection</a>
          <a href="#journey-process">Our Process</a>
          <a href="/contact">Contact</a>
        </nav>

        <a className="journey-nav-cta" href="/export-quote">
          Export Enquiry <span>↗</span>
        </a>
      </header>

      <div className="journey-layout">
        <section className="journey-copy">
          <div className="journey-eyebrow">
            <span /> INDIA <b>→</b> MIDDLE EAST
          </div>

          <h1>
            From Indian
            <br />
            Quarries to
            <br />
            <em>Global Spaces.</em>
          </h1>

          <p>
            Premium granite and natural stone, sourced in India for
            architectural projects across the Middle East. From fresh blocks
            to custom-cut pieces, discover stone shaped around your project.
          </p>

          <div className="journey-buttons">
            <a className="journey-gold-button" href="/catlog-product">
              Explore Our Stones <span>→</span>
            </a>

            <button
              className="journey-play-button"
              onClick={() => setJourney((value) => !value)}
              aria-pressed={journey}
            >
              <span className="play-icon">{journey ? "Ⅱ" : "▶"}</span>
              {journey ? "Journey in motion" : "Explore the journey"}
            </button>
          </div>

          {journey && (
            <div className="journey-live">
              <span className="live-dot" />
              <div>
                <strong>India → Middle East</strong>
                <small>Explore sourcing, finishing and export supply.</small>
              </div>
            </div>
          )}

          <div className="journey-stats">
            <div><strong>50+</strong><span>Granite varieties</span></div>
            <div><strong>Custom</strong><span>Cut-to-size options</span></div>
            <div><strong>B2B</strong><span>Project supply</span></div>
          </div>
        </section>

        <section className="journey-visual" aria-label="Interactive granite collection">
          <div className="route-label route-india">
            <span className="route-light" />
            <strong>INDIA</strong>
            <small>Stone sourcing</small>
          </div>

          <div className="route-label route-middle">
            <span className="route-light" />
            <strong>MIDDLE EAST</strong>
            <small>Project destination</small>
          </div>

          <div className="visual-caption">
            <span>01 — 04</span>
            <span>THE STONE EDIT</span>
          </div>

          <div className="slab-stage">
            {stones.map((item, index) => (
              <button
                key={item.name}
                className={`stone-slab slab-${index} ${selected === index ? "slab-active" : ""}`}
                style={{ "--slab-image": `url("${item.image}")` }}
                onClick={() => setSelected(index)}
                aria-label={`Explore ${item.name}`}
                aria-pressed={selected === index}
              >
                <span className="slab-face" />
                <span className="slab-edge" />
                <span className="slab-name">{item.name}</span>
              </button>
            ))}
          </div>

          <div className="selected-stone">
            <div
              className="selected-stone-image"
              style={{ backgroundImage: `url("${stone.image}")` }}
            />
            <div className="selected-stone-copy">
              <small>{stone.type}</small>
              <h2>{stone.name}</h2>
              <p>Available finish: {stone.finish}</p>
              <a href="/export-quote">Enquire about this stone ↗</a>
            </div>
          </div>

          <div className="visual-bottom">
            <span>QUARRY SOURCING</span>
            <span className="visual-bottom-line" />
            <span>PRECISION CUTTING</span>
            <span className="visual-bottom-line" />
            <span>EXPORT SUPPLY</span>
          </div>
        </section>
      </div>

      <footer className="journey-footer" id="journey-process">
        <span>INDIAN ORIGIN</span>
        <span>—</span>
        <span>SELECTED NATURAL STONE</span>
        <span>—</span>
        <span>GLOBAL PROJECTS</span>
        <a href="/export-quote">Discuss your requirements ↗</a>
      </footer>
    </main>
  );
}
